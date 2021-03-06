import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { SpaceModule } from '../space/space.module';
import { MemberModule } from '../member/member.module';
import { TaggedMemberModule } from '../tagged-member/tagged-member.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]),forwardRef(() => SpaceModule), forwardRef(() => MemberModule), forwardRef(() => TaggedMemberModule)],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
