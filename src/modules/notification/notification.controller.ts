import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { NormalNotificationDto } from './dto/normal-notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Access token is invalid', error: 'Unauthorized' } } })
@ApiForbiddenResponse({schema: {example:{statusCode: 403, message: 'Access token expired', error: 'Forbidden'}}})
@ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
@ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/create-normal-notification')
  async createNotification(@Body() notification: NormalNotificationDto, @Request() req): Promise<any>{
    console.log(notification);
    return await this.notificationService.createNotification(notification, req.headers.email);
  }

  
  
}
