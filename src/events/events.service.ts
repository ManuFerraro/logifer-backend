import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

interface ConnectedClient {
  [id: string]: {
      socket: Socket,
      user: User,
  }
}



@Injectable()
export class EventsService {}
