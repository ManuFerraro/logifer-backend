import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductOrderModule } from 'src/product-order/product-order.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
     TypeOrmModule.forFeature([Product]),
  ],
  exports: [TypeOrmModule]
})
export class ProductsModule {}
