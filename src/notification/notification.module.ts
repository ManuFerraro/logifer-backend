import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([ Notification ]),
    AuthModule,
  ],
  exports: [ TypeOrmModule, NotificationService ]
})
export class NotificationModule {}
