import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QuerySearchDto } from 'src/common/dto/searchByQuery.dto';


@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('register')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }
  
  @Get('seek')
  findClientByQuery(@Query() querySearchDto: QuerySearchDto) {
    return this.clientsService.findClientByQuery(querySearchDto)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clientsService.findOne(+id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
