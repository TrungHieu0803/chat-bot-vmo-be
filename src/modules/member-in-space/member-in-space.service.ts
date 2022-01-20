import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberInSpaceEntity } from './member-in-space.entity';

@Injectable()
export class MemberInSpaceService {
    constructor(
        @InjectRepository(MemberInSpaceEntity) private memberInSpaceRepo: Repository<MemberInSpaceEntity>
    ){}

    async totalMember(spaceId: number): Promise<number>{
        try {
            const result = await this.memberInSpaceRepo.createQueryBuilder().select().where('spaceId = :spaceId', {spaceId: spaceId}).getCount();
            return result
        } catch (error) {
            throw new InternalServerErrorException('Database connection error');
        }
    }
}
