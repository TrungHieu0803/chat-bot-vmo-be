import { Module } from '@nestjs/common';
import { NotificationHistoryService } from './notification-history.service';
import { NotificationHistoryController } from './notification-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationHistoryEntity } from './notification-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationHistoryEntity])],
  controllers: [NotificationHistoryController],
  providers: [NotificationHistoryService]
})
export class NotificationHistoryModule {}
