import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from './space.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SpaceEntity, ])],
  controllers: [SpaceController],
  providers: [SpaceService]
})
export class SpaceModule {}
