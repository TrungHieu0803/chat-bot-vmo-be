import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { Repository } from 'typeorm';
import { MemberService } from '../member/member.service';
import { SpaceService } from '../space/space.service';
import { TaggedMemberService } from '../tagged-member/tagged-member.service';
import { NormalNotificationDto } from './dto/normal-notification.dto';
import { NotificationEntity } from './notification.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MemberEntity } from '../member/member.entity';
import { createMessage } from 'src/google-chat-apis/google-chat-apis';

@Injectable()
export class NotificationService {


  constructor(
    @InjectRepository(NotificationEntity) private notificationRepo: Repository<NotificationEntity>,
    @Inject(forwardRef(() => SpaceService)) private spaceService: SpaceService,
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
    @Inject(forwardRef(() => TaggedMemberService)) private taggedMemberService: TaggedMemberService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  async createNotification(notification: NormalNotificationDto, email: string): Promise<any> {
    const notificationEntity = new NotificationEntity();
    const space = await this.spaceService.findById(notification.spaceId);
    const createdBy = await this.memberService.findByEmail(email);
    let dayOfWeek = '';
    if (notification.dayOfWeek.length == 0) {
      console.log(notification.year)
      const d = new Date();
      const currentYear = d.getFullYear();
      const currentMonth = d.getMonth();
      notificationEntity.sendAtDayOfMonth = notification.dayOfMonth;
      notificationEntity.sendAtMonths = ((parseInt(notification.year) - currentYear) * 12 - currentMonth + parseInt(notification.month)).toString();
      notificationEntity.sendAtDayOfWeek = '*';
    } else {
      notification.dayOfWeek.forEach((value) => dayOfWeek += `${value},`);
      notificationEntity.sendAtDayOfMonth = '*';
      notificationEntity.sendAtMonths = '*';
      notificationEntity.sendAtDayOfWeek = dayOfWeek.substring(0, dayOfWeek.length - 1);
    }
    notificationEntity.name = notification.name;
    notificationEntity.content = notification.content;
    notificationEntity.isEnable = true;
    notificationEntity.sendAtHour = notification.hour;
    notificationEntity.sendAtMinute = notification.minute;
    notificationEntity.threadId = notification.threadId;
    notificationEntity.space = space;
    notificationEntity.member = createdBy;
    try {
      const result = await this.notificationRepo.save(notificationEntity);
      const isTagAll = notification.tags.find((tag) => tag == 'Tất cả');
      const members = [];
      if (isTagAll == 'Tất cả' || notification.tags.length == 0) {
        await this.taggedMemberService.add(result);
      } else {
        for (let tag of notification.tags) {
          const member = await this.memberService.findByName(tag);
          members.push(member);
          await this.taggedMemberService.add(result, member);
        }
      }
      this.addCronJobForNormalNotification(space.name, result, members);
      return { message: 'success' }
    } catch (error) {
      throw new InternalServerErrorException(`Database connection error: ${error}`);
    }
  }

  addCronJobForNormalNotification(spaceName: string, notification: NotificationEntity, members: MemberEntity[]) {
    const job = new CronJob(`0 ${notification.sendAtMinute} ${notification.sendAtHour} ${notification.sendAtDayOfMonth} ${notification.sendAtMonths} ${notification.sendAtDayOfWeek}`, () => {
        createMessage(notification.content, members, spaceName ,notification.threadId);
    });
    this.schedulerRegistry.addCronJob(notification.id.toString(), job);
    job.start();
  }


}
