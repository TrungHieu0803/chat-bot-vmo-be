import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { SpaceModule } from './modules/space/space.module';
import { MemberInSpaceModule } from './modules/member-in-space/member-in-space.module';
import { MemberModule } from './modules/member/member.module';
import { TaggedMemberModule } from './modules/tagged-member/tagged-member.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SendToModule } from './modules/send-to/send-to.module';
import { NotificationHistoryModule } from './modules/notification-history/notification-history.module';
import { ReceivedMessageModule } from './modules/received-message/received-message.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import path, { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { LoggerMiddleware } from './common/middleware/middleware';
import { AuthModule } from './modules/auth/auth.module';



@Module({
  imports: [
    UserModule,
    SpaceModule,
    MemberInSpaceModule,
    MemberModule,
    TaggedMemberModule,
    NotificationModule,
    SendToModule,
    NotificationHistoryModule,
    ReceivedMessageModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database.config'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    AuthModule,
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
}) 
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude()
      .forRoutes('user');
  }
}
