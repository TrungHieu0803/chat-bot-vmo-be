import { Controller } from '@nestjs/common';
import { NotificationHistoryService } from './notification-history.service';

@Controller('notification-history')
export class NotificationHistoryController {
  constructor(private readonly notificationHistoryService: NotificationHistoryService) {}
}
