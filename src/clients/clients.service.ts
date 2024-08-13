import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Like, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { QuerySearchDto } from '../common/dto/searchByQuery.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger('ClientsServices')
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {

  }

  async create(createClientDto: CreateClientDto) {
      const {  email, nombre, apellido, direccion } = createClientDto;
      try {
        const cliente = await this.clientRepository.findOne({
          where: {email: email, apellido: apellido, direccion: direccion},
        })

        if (cliente) {
            throw new BadRequestException('El cliente ya existe')
        }

        const newClient = await this.clientRepository.create({
            nombre,
            apellido,
            direccion,
            email,
        })
        await this.clientRepository.save(newClient)

        return newClient;
           
      } catch (error) {
        throw this.handleExceptions(error)
        
      }
   
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0} = paginationDto;
    
    const allClients = await this.clientRepository.find({
      take: limit,
      skip: offset,
      relations: ['orders'],
    });
    
    return allClients;
  }

  async findOne(id: number) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id: id},
        relations: ['orders'],
      })

      if (!client)
          throw new BadRequestException('El cliente no existe')
      return client;
    } catch (error) {
      throw this.handleExceptions(error)
    }
  }


  async findClientByQuery(querySearchDto: QuerySearchDto) {
    const { search = '' } = querySearchDto;
    try {
      const lowerWord = search.toLowerCase();
      const foundedClients = await this.clientRepository.find({
        where: [
          { nombre: Like(`%${lowerWord}%`) },
          { apellido: Like(`%${lowerWord}%`) }
        ],
        select: { nombre: true, apellido: true, direccion: true, id: true, email: true}
      });
  
      if (foundedClients.length === 0) {
        throw new BadRequestException('No se encontraron clientes');
      }
  
      return foundedClients;
    } catch (error) {
      throw this.handleExceptions(error);
    }
  }

  async remove(id: number) {
    const deleteClient = await this.clientRepository.findOne({ where: { id: id }})

    if (!deleteClient) 
         throw new BadRequestException('El cliente que desea eliminar no existe')

    await this.clientRepository.remove(deleteClient);
    
    return {
      message: 'El cliente se ha eliminado con éxito',
      deletedClient: deleteClient
    }
  }

  private handleExceptions( error: any ) {
    if( error.code === '23505' ) {
      throw new BadRequestException(error.detail)
    } 

    this.logger.error(error)

    throw new BadRequestException(error)
  }
}
