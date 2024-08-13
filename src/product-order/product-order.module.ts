import { Module } from '@nestjs/common';
import { ProductOrderService } from './product-order.service';
import { ProductOrderController } from './product-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrder } from './entities/product-order.entity';


@Module({
  controllers: [ProductOrderController],
  providers: [ProductOrderService],
  imports: [
    TypeOrmModule.forFeature([ProductOrder]),
 
  ],
  exports: [TypeOrmModule],
})
export class ProductOrderModule {}
