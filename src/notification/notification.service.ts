import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrderNotification(orderMessage: string, userId: string, type: string) {
  
    const user = await this.userRepository.findOne({ where: { id: userId}});
    if (!user) {
      throw new Error('User not found');
    }

    const notification = this.notificationRepository.create({
      message: orderMessage,
      type: type,
      createdAt: new Date(),
      user: user
    });
    
    await this.notificationRepository.save(notification);
  }


  async findAll() {
    

      
    const allNotification = await this.notificationRepository.find({
      relations: ['user'],
    });

    const mappedNotifications = allNotification.map(notification => ({
      id: notification.id,
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt,
      user: {
        id: notification.user.id,
        email: notification.user.email,
        fullName: notification.user.fullName
      }
    }));
  
    return mappedNotifications;

  }


}
