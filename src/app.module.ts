import { Module } from '@nestjs/common';
import { AirdropModule } from './airdrop/airdrop.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [AirdropModule, UploadModule],
})
export class AppModule {}
