import { Controller } from '@nestjs/common';
import { SendToService } from './send-to.service';

@Controller('send-to')
export class SendToController {
  constructor(private readonly sendToService: SendToService) {}
}
