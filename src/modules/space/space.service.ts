import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginateResponse } from 'src/common/paginate/paginate';
import { Repository } from 'typeorm';
import { MemberInSpaceService } from '../member-in-space/member-in-space.service';
import { SpaceEntity } from './space.entity';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceEntity) private spaceRepo: Repository<SpaceEntity>,
        @Inject(forwardRef(() => MemberInSpaceService)) private memberInSpaceService: MemberInSpaceService,
    ){}

    async getListSpace(take: number, page: number): Promise<any>{
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        try {
            const spaces = await this.spaceRepo.createQueryBuilder().orderBy('name', 'ASC').skip(skipQuery).take(takeQuery).getMany();
            const totalSpace = await this.spaceRepo.createQueryBuilder().select().getCount();
            const result = [];
            for(let space of spaces){
                const totalMember = await this.memberInSpaceService.totalMember(space.id);
                result.push({...space, totalMember});
            }
            return paginateResponse(result, pageQuery, takeQuery, totalSpace);
        } catch (error) {
            
        }
    }
}
