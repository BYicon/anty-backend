import { Module } from '@nestjs/common';
import { AirdropModule } from './airdrop/airdrop.module';

@Module({
  imports: [AirdropModule],
})
export class AppModule {}
