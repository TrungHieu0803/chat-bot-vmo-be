import { Controller } from '@nestjs/common';
import { ReceivedMessageService } from './received-message.service';

@Controller('received-message')
export class ReceivedMessageController {
  constructor(private readonly receivedMessageService: ReceivedMessageService) {}
}
