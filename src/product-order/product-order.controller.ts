import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductOrderService } from './product-order.service';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';

@Controller('product-order')
export class ProductOrderController {
  constructor(private readonly productOrderService: ProductOrderService) {}
}
