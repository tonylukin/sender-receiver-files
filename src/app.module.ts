import { Module } from '@nestjs/common';
import { SenderController } from './controllers/sender.controller';
import { ReceiverController } from './controllers/receiver.controller';
import { ReceiverService } from './services/receiver.service';
import { SenderService } from './services/sender.service';

@Module({
  imports: [],
  controllers: [SenderController, ReceiverController],
  providers: [ReceiverService, SenderService],
})
export class AppModule {}
