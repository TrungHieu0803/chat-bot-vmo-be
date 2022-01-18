import { Module } from '@nestjs/common';
import { SendToService } from './send-to.service';
import { SendToController } from './send-to.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendToEntity } from './send-to.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SendToEntity])],
  controllers: [SendToController],
  providers: [SendToService]
})
export class SendToModule {}
