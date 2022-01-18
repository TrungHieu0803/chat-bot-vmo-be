import { Module } from '@nestjs/common';
import { MemberInSpaceService } from './member-in-space.service';
import { MemberInSpaceController } from './member-in-space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberInSpaceEntity } from './member-in-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberInSpaceEntity])],
  controllers: [MemberInSpaceController],
  providers: [MemberInSpaceService]
})
export class MemberInSpaceModule {}
