import { Module } from '@nestjs/common';
import { TaggedMemberService } from './tagged-member.service';
import { TaggedMemberController } from './tagged-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaggedMemberEntity } from './tagged-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaggedMemberEntity])],
  controllers: [TaggedMemberController],
  providers: [TaggedMemberService]
})
export class TaggedMemberModule {}
