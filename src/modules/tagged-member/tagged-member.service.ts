import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from '../member/member.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { SpaceEntity } from '../space/space.entity';
import { TaggedMemberEntity } from './tagged-member.entity';

@Injectable()
export class TaggedMemberService {

    constructor(
        @InjectRepository(TaggedMemberEntity) private taggedMemberRepo: Repository<TaggedMemberEntity>,
    ) { }

    async add(notification: NotificationEntity, member?: MemberEntity): Promise<TaggedMemberEntity>{
        const taggedMemberEntity = new TaggedMemberEntity();
        taggedMemberEntity.notification = notification;
        taggedMemberEntity.member = member;
        try {
            const result = await this.taggedMemberRepo.save(taggedMemberEntity);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(`Database connection error: ${error}`);
        }
    }
}
