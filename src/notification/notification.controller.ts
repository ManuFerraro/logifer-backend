import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll() {
   return this.notificationService.findAll()
  }
}
