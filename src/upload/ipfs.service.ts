import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class IpfsService {
  private readonly PINATA_API_URL = process.env.PINATA_API_URL;
  private readonly PINATA_API_KEY = process.env.PINATA_API_KEY;

  async uploadToIpfs(file: Express.Multer.File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
      });

      const response = await axios.post(this.PINATA_API_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${this.PINATA_API_KEY}`,
        },
        maxBodyLength: Infinity,
      });

      return response.data.IpfsHash;
    } catch (error) {
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }
}
