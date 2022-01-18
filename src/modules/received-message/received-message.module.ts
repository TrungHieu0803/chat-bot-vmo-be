import { Module } from '@nestjs/common';
import { ReceivedMessageService } from './received-message.service';
import { ReceivedMessageController } from './received-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivedMessageEntity } from './received-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReceivedMessageEntity])],
  controllers: [ReceivedMessageController],
  providers: [ReceivedMessageService]
})
export class ReceivedMessageModule {}
