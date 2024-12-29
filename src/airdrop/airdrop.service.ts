import { Injectable } from '@nestjs/common';
import { privateKeyToAccount } from 'viem/accounts';
import {
  createWalletClient,
  encodePacked,
  keccak256,
  http,
  isAddress,
  toBytes,
  Account,
  WalletClient,
} from 'viem';

import { sepolia } from 'viem/chains';
import { ISignResponse } from 'src/shared/types';

@Injectable()
export class AirdropService {
  private balances: Map<string, number> = new Map();
  private totalSupply: number = 100_000_000;
  private decimals: number = 18;
  private privateKey: `0x${string}`;
  public account: Account;
  private wallet: WalletClient;
  private nonce: number = 0;

  constructor() {
    // 初始化合约拥有者的余额
    this.balances.set('owner', this.totalSupply);
    this.privateKey = process.env.PRIVATE_KEY as `0x${string}`;
    this.account = privateKeyToAccount(this.privateKey);
    console.log('account 🚀🚀🚀', this.account);
    this.wallet = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: http(),
    });
  }
  async sign(recipient: string): Promise<ISignResponse> {
    if (!isAddress(recipient)) {
      throw new Error('Invalid address');
    }
    const amount = 1e10;
    this.nonce++;
    const deadline = Math.floor(
      new Date(Date.now() / 1000 + 60 * 60 * 1).getTime(),
    );

    // 构建消息哈希
    const messageHash = this.getMessageHash(
      recipient,
      amount,
      this.nonce,
      deadline,
    );

    const signature = await this.wallet.signMessage({
      account: this.account,
      message: { raw: toBytes(messageHash) },
    });

    // 调用合约发送token
    return {
      amount,
      nonce: this.nonce,
      deadline,
      signature,
    };
  }

  // 构建消息哈希函数
  private getMessageHash(
    recipient: string,
    amount: number,
    nonce: number,
    deadline: number,
  ): string {
    const types = ['address', 'uint256', 'uint256', 'uint256'];
    const values = [recipient, amount, nonce, deadline];
    const messageHash = keccak256(encodePacked(types, values));
    return messageHash;
  }

  async getBalance(): Promise<string> {
    const balanceHex: string = await this.wallet.request({
      method: 'eth_getBalance',
      params: [this.account.address, 'latest'],
    });
    return balanceHex; // Convert Wei to Ether
  }
}
