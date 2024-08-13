import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [EventsGateway, EventsService],
  imports: [ AuthModule ],
  exports: [ EventsGateway ],
})
export class EventsModule {}
