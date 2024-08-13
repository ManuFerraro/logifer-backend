import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ProductOrderModule } from './product-order/product-order.module';
import { EventsModule } from './events/events.module';
import { NotificationModule } from './notification/notification.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,

    ClientsModule,

    OrdersModule,

    ProductsModule,

    ProductOrderModule,

    EventsModule,

    NotificationModule,

   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
