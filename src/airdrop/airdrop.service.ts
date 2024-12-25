import { Injectable } from '@nestjs/common';
// import { ethers } from 'ethers';
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
  private client: WalletClient;
  private nonce: number = 0;

  constructor() {
    // 初始化合约拥有者的余额
    this.balances.set('owner', this.totalSupply);
    this.privateKey = process.env.PRIVATE_KEY as `0x${string}`;
    this.account = privateKeyToAccount(this.privateKey);
    this.client = createWalletClient({
      chain: sepolia,
      transport: http(),
    });
  }

  async getBalance(): Promise<string> {
    const balanceHex: string = await this.client.request({
      method: 'eth_getBalance',
      params: [this.account.address, 'latest'],
    });
    console.log('balanceHex 🟢🟢🟢', balanceHex);
    const balance = BigInt(balanceHex);
    console.log('balance 🟢🟢🟢', balance);
    return (balance / BigInt(1e18)).toString(); // Convert Wei to Ether
  }

  async sign(recipient: string): Promise<ISignResponse> {
    if (!isAddress(recipient)) {
      throw new Error('Invalid address');
    }
    const amount = 1000000000000000000;
    this.nonce++;
    const deadline = Math.floor(
      new Date(Date.now() + 1000 * 60 * 60 * 24).getTime() / 1000,
    );

    // 构建消息哈希
    const messageHash = this.getMessageHash(
      recipient,
      amount,
      this.nonce,
      deadline,
    );

    const signature = await this.client.signMessage({
      account: this.account,
      message: { raw: toBytes(messageHash) },
    });

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
    const types = ['address', 'uint256', 'uint256', 'uint32'];
    const values = [recipient, amount, nonce, deadline];
    const packedData = encodePacked(types, values);
    const messageHash = keccak256(packedData);
    return messageHash;
  }

  // 转账
  //   transfer(to: string, amount: number): boolean {
  //     const fromBalance = this.getBalance();
  //     if (fromBalance < amount) {
  //       throw new Error('余额不足');
  //     }
  //     this.balances.set(this.account.address, fromBalance - amount);
  //     this.balances.set(to, this.getBalance(to) + amount);
  //     return true;
  //   }

  //   // 空投
  //   airdrop(recipients: string[], amount: number): void {
  //     recipients.forEach((recipient) => {
  //       this.transfer('owner', recipient, amount);
  //     });
  //   }
}
