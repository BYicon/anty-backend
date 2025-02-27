import { Injectable } from '@nestjs/common';
import { UploadResponseDto } from './dto/upload-response.dto';
import { IpfsService } from './ipfs.service';

@Injectable()
export class UploadService {
  constructor(private readonly ipfsService: IpfsService) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadResponseDto> {
    const ipfsHash = await this.ipfsService.uploadToIpfs(file);
    const gatewayUrl = process.env.PINATA_GATEWAY_URL;
    return {
      url: `${gatewayUrl}${ipfsHash}`,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
