import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductOrderModule } from 'src/product-order/product-order.module';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { EventsModule } from 'src/events/events.module';


@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductOrderModule,
    ProductsModule,
    AuthModule,
    NotificationModule,
    EventsModule,
  ],
  
})
export class OrdersModule {}
