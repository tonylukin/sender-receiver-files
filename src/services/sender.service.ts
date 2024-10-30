import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import axios from 'axios';
import * as path from 'path';
import { Manifest } from '../interfaces/manifest';

@Injectable()
export class SenderService {
  private readonly chunkSize = 100 * 1024 * 1024; // 100 MB
  private readonly maxRetries = 3;

  async sendFile(filePath: string, receiverUrl: string) {
    const manifest: Manifest = await this.createManifest(filePath);

    await axios.post(`${receiverUrl}/receive/manifest`, manifest);

    const fileStream = fs.createReadStream(filePath, {
      highWaterMark: this.chunkSize,
    });
    let chunkIndex = 0;
    const uploadPromises = [];
    for await (const chunk of fileStream) {
      const chunkHash = crypto.createHash('md5').update(chunk).digest('hex');
      const chunkData = {
        index: chunkIndex,
        data: chunk,
        md5: chunkHash,
      };

      uploadPromises.push(this.uploadChunkWithRetry(chunkData, receiverUrl));
      chunkIndex++;
    }

    await Promise.all(uploadPromises);
  }

  private async uploadChunkWithRetry(
    chunkData: any,
    receiverUrl: string,
    retryCount = 0,
  ): Promise<void> {
    try {
      await axios.post(`${receiverUrl}/receive/chunk`, chunkData);
      console.log(`Chunk ${chunkData.index} uploaded successfully`);
    } catch (error) {
      if (retryCount < this.maxRetries) {
        console.error(
          `Retrying upload of chunk ${chunkData.index} (attempt ${retryCount + 1})`,
        );
        return this.uploadChunkWithRetry(
          chunkData,
          receiverUrl,
          retryCount + 1,
        );
      } else {
        console.error(
          `Failed to upload chunk ${chunkData.index} after ${this.maxRetries} attempts`,
        );
      }
    }
  }

  private async createManifest(filePath: string) {
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    const manifest: Manifest = {
      fileName: path.basename(filePath),
      fileSize,
      chunkCount: Math.ceil(fileSize / this.chunkSize),
      chunks: [] as { index: number; md5: string }[],
    };

    const fileStream = fs.createReadStream(filePath, {
      highWaterMark: this.chunkSize,
    });
    let chunkIndex = 0;
    for await (const chunk of fileStream) {
      const chunkHash = crypto.createHash('md5').update(chunk).digest('hex');
      manifest.chunks.push({ index: chunkIndex, md5: chunkHash });
      chunkIndex++;
    }
    return manifest;
  }
}
