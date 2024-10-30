import { Controller, Post, Body } from '@nestjs/common';
import { SenderService } from '../services/sender.service';

@Controller('send')
export class SenderController {
  constructor(private readonly senderService: SenderService) {}

  @Post('file')
  async sendFile(
    @Body('filePath') filePath: string,
    @Body('receiverUrl') receiverUrl: string,
  ) {
    await this.senderService.sendFile(filePath, receiverUrl);
    return { message: 'File transfer initiated' };
  }
}
