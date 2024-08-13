import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@WebSocketGateway({ cors: true})
export class EventsGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly eventsService: EventsService,
              private readonly jwtService: JwtService,
  ) {}



  async sendOrderNotification(orderMessage: string, idUser: string, type: string) {
    console.log(orderMessage)
    this.server.emit('orderUpdated', { message: orderMessage, idUser: idUser, type: type});
  }





// @SubscribeMessage('mensaje')
// handleMessange(@MessageBody() data: any) {
//   this.server.emit('menssageFromServer', data)
// }




  // @SubscribeMessage('createEvent')
  // create(@MessageBody() createEventDto: CreateEventDto) {
  //   return this.eventsService.create(createEventDto);
  // }

  // @SubscribeMessage('findAllEvents')
  // findAll() {
  //   return this.eventsService.findAll();
  // }

  // @SubscribeMessage('findOneEvent')
  // findOne(@MessageBody() id: number) {
  //   return this.eventsService.findOne(id);
  // }

  // @SubscribeMessage('updateEvent')
  // update(@MessageBody() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(updateEventDto.id, updateEventDto);
  // }

  // @SubscribeMessage('removeEvent')
  // remove(@MessageBody() id: number) {
  //   return this.eventsService.remove(id);
  // }
}
