import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from '../member/member.entity';
import { SpaceEntity } from '../space/space.entity';
import { MemberInSpaceEntity } from './member-in-space.entity';

@Injectable()
export class MemberInSpaceService {
    constructor(
        @InjectRepository(MemberInSpaceEntity) private memberInSpaceRepo: Repository<MemberInSpaceEntity>
    ) { }

    async totalMember(spaceId: number): Promise<number> {
        try {
            const result = await this.memberInSpaceRepo.createQueryBuilder().select().where('spaceId = :spaceId', { spaceId: spaceId }).getCount();
            return result
        } catch (error) {
            throw new InternalServerErrorException(`Database connection error: ${error}`);
        }
    }

    async addMemberToSpace(space: SpaceEntity, member: MemberEntity, role: string) {
        const isAdded = await this.memberInSpaceRepo.findOne({space: space, member: member});
        if(isAdded != null){
            return null;
        }
        const memberInSpaceEntity = new MemberInSpaceEntity();
        memberInSpaceEntity.space = space;
        memberInSpaceEntity.member = member;
        memberInSpaceEntity.role = role;
        try {
            const result = await this.memberInSpaceRepo.save(memberInSpaceEntity);
            return result;
        } catch (error) {
            throw new InternalServerErrorException(`Database connection error: ${error}`);
        }
    }
}
