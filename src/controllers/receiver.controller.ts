import { Controller, Post, Body } from '@nestjs/common';
import { ReceiverService } from '../services/receiver.service';
import { Manifest } from '../interfaces/manifest';

@Controller('receive')
export class ReceiverController {
  constructor(private readonly receiverService: ReceiverService) {}

  @Post('manifest')
  receiveManifest(
    @Body()
    manifest: Manifest,
  ) {
    this.receiverService.receiveManifest(manifest);
    return { message: 'Manifest received' };
  }

  @Post('chunk')
  async receiveChunk(
    @Body() chunkData: { index: number; data: Buffer; md5: string },
  ) {
    await this.receiverService.receiveChunk(chunkData);
    return { message: `Chunk ${chunkData.index} received` };
  }
}
