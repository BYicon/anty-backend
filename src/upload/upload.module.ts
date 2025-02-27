import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { IpfsService } from './ipfs.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, IpfsService],
})
export class UploadModule {}
