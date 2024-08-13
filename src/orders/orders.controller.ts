import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QuerySearchDto } from 'src/common/dto/searchByQuery.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @Get('seek')
  findOrderByQuery(@Query() querySearchDto: QuerySearchDto) {
    return this.ordersService.findOrderByQuery(querySearchDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto,  @GetUser() user: User,) {
    return this.ordersService.update(+id, updateOrderDto, user);
  }

  @Patch('edit/:id')
  editOrder(@Param('id') id:string, @Body() updateOrderDto: UpdateOrderDto){
    return this.ordersService.editOrder(+id, updateOrderDto)
  }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
