import { Controller, Get, Query } from '@nestjs/common';
import { AirdropService } from './airdrop.service';
import { ISignResponse } from 'src/shared/types';

@Controller('airdrop')
export class AirdropController {
  constructor(private readonly airdropService: AirdropService) {}

  @Get('balance')
  async getBalance(): Promise<string> {
    return this.airdropService.getBalance();
  }

  @Get('sign')
  async sign(@Query('recipient') recipient: string): Promise<ISignResponse> {
    return this.airdropService.sign(recipient);
  }
}
