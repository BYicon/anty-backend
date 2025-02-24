import { Injectable } from '@nestjs/common';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<UploadResponseDto> {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    console.log(file);

    return {
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
