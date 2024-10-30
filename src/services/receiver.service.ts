import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { Manifest } from '../interfaces/manifest';

@Injectable()
export class ReceiverService {
  private readonly receivedChunks: Map<number, Buffer> = new Map();
  private manifest: Manifest | null = null;

  receiveManifest(manifest: Manifest) {
    this.manifest = manifest;
    console.log('Manifest received:', manifest);
  }

  async receiveChunk(chunkData: { index: number; data: Buffer; md5: string }) {
    const { index, data, md5 } = chunkData;

    const hash = crypto
      .createHash('md5')
      .update(Buffer.from(data))
      .digest('hex');
    if (hash !== md5) {
      console.error(`Integrity check failed for chunk ${index}`);
      return;
    }

    this.receivedChunks.set(index, data);
    console.log(`Chunk ${index} verified successfully`);

    // Check if we have all chunks
    if (this.receivedChunks.size === this.manifest?.chunkCount) {
      await this.reassembleFile();
    }
  }

  private async reassembleFile() {
    const filePath = `${__dirname}/../../output/${this.manifest!.fileName}`;
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

    for (let i = 0; i < this.manifest!.chunkCount; i++) {
      writeStream.write(Buffer.from(this.receivedChunks.get(i)));
    }

    writeStream.end();
    console.log('File reassembly complete');
  }
}
