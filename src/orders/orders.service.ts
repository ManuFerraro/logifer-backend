import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductOrder } from 'src/product-order/entities/product-order.entity';
import { Product } from 'src/products/entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QuerySearchDto } from 'src/common/dto/searchByQuery.dto';
import { User } from 'src/auth/entities/user.entity';
import { NotificationService } from 'src/notification/notification.service';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly notificationService: NotificationService,
    private readonly eventsGateway: EventsGateway,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    let hasError = false;

    const order = this.orderRepository.create({
      clientId: createOrderDto.clientId,
      direccionDeEnvio: createOrderDto.direccionDeEnvio,
      status: createOrderDto.status,
      deliveryDate: createOrderDto.deliveryDate,
    });

    // Validar cada producto de la orden
    for (const productOrderDto of createOrderDto.productOrder) {
      // Verificar si el producto existe
      const product = await this.productRepository.findOne({ where: { id: productOrderDto.productId } });
      if (!product) {
        hasError = true;
        throw new BadRequestException(`El producto con ID ${productOrderDto.productId} no existe.`);
      }

      // Verificar si la unidad de medida seleccionada es válida para el producto
      if (!product.unidadMedida.includes(productOrderDto.unidadMedida)) {
        hasError = true;
        throw new BadRequestException(`La unidad de medida '${productOrderDto.unidadMedida}' no es válida para el producto ${product.producto}.`);
      }

      // Calcular la cantidad equivalente en la unidad de medida base del producto
      const equivalentQuantity = this.calculateEquivalentQuantity(product, productOrderDto.quantity, productOrderDto.unidadMedida);

      // Verificar si hay suficiente stock disponible
      if (equivalentQuantity > product.stock) {
        hasError = true;
        throw new BadRequestException(`No hay suficiente stock disponible para el producto ${product.producto}.`);
      }

      // Restar esta cantidad del stock disponible del producto
      if (createOrderDto.status === 'success') {
        product.stock -= equivalentQuantity;

        // Guardar los cambios en el producto
        await this.productRepository.save(product);
      }
    }

    // Si no hay errores, guardar la orden y los productos asociados
    if (!hasError) {
      const savedOrder = await this.orderRepository.save(order);

      // Crear y guardar los productos asociados a la orden
      for (const productOrderDto of createOrderDto.productOrder) {
      
        const product = await this.productRepository.findOne({ where: { id: productOrderDto.productId } });
        const formattedQuantity = this.formatQuantity(productOrderDto.quantity);
        const productOrder = this.productOrderRepository.create({
          order: savedOrder,
          product: product,
          quantity: formattedQuantity,
          unidadMedida: productOrderDto.unidadMedida
        });
       
        await this.productOrderRepository.save(productOrder);
      }

      return savedOrder;
    }
  }


  private formatQuantity(quantity: number): number {
    // Si es un número entero, devolverlo tal cual
    if (Number.isInteger(quantity)) {
        return quantity;
    } else {
        // Si es un número decimal, redondearlo a dos decimales
        return parseFloat(quantity.toFixed(2));
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, user: User) {
  
    const order = await this.findRelationOrder(id)
    
    if (!order) {
        throw new NotFoundException(`La orden con ID ${id} no fue encontrada.`);
    }

    const oldStatus = order.status;

    if (updateOrderDto.status) {
        order.status = updateOrderDto.status;
    }
    if (updateOrderDto.deliveryDate) {
        order.deliveryDate = updateOrderDto.deliveryDate;
    }

   
    if (oldStatus === 'pending' && updateOrderDto.status === 'success') {
      for (const productOrder of order.productOrder) {

        const product = await this.productRepository.findOne({ where: { id: productOrder.product.id} })
          if (!product) {
              throw new BadRequestException(`El producto con ID ${productOrder.product.id} no existe.`);
          }

          const equivalentQuantity = this.calculateEquivalentQuantity(product, productOrder.quantity, productOrder.unidadMedida);
          
          if (equivalentQuantity > product.stock) {
            throw new BadRequestException(`No hay suficiente stock disponible para el producto ${product.producto}.`);
          }
          product.stock -= equivalentQuantity;
          await this.productRepository.save(product);
      }
  }
                              
    const updatedOrder = await this.orderRepository.save(order);
    
    const orderMessage = `El pedido para ${order.client.nombre + ' ' + order.client.apellido} fue enviado `
    await this.notificationService.createOrderNotification(orderMessage, user.id, 'order')

    await this.eventsGateway.sendOrderNotification(orderMessage, user.id, 'order')

    return updatedOrder;
    
}







async editOrder(id: number, updateOrderDto: UpdateOrderDto) {
  let hasError = false;
  const order = await this.orderRepository.findOne({ where: { id: id } });

  if (!order) {
      throw new NotFoundException(`La orden con ID ${id} no fue encontrada.`);
  }

  // Eliminar productos asociados a la orden existentes
  await this.productOrderRepository.delete({ order: order });

  for (const productOrderDto of updateOrderDto.productOrder) {
      // Verificar si el producto existe
      const product = await this.productRepository.findOne({ where: { id: productOrderDto.productId } });
      if (!product) {
          hasError = true;
          throw new BadRequestException(`El producto con ID ${productOrderDto.productId} no existe.`);
      }

      // Verificar si la unidad de medida seleccionada es válida para el producto
      if (!product.unidadMedida.includes(productOrderDto.unidadMedida)) {
          hasError = true;
          throw new BadRequestException(`La unidad de medida '${productOrderDto.unidadMedida}' no es válida para el producto ${product.producto}.`);
      }

      // Calcular la cantidad equivalente en la unidad de medida base del producto
      const equivalentQuantity = this.calculateEquivalentQuantity(product, productOrderDto.quantity, productOrderDto.unidadMedida);

      // Verificar si hay suficiente stock disponible
      if (equivalentQuantity > product.stock) {
          hasError = true;
          throw new BadRequestException(`No hay suficiente stock disponible para el producto ${product.producto}.`);
      }

      // Restar esta cantidad del stock disponible del producto
      if (updateOrderDto.status === 'success') {
          product.stock -= equivalentQuantity;

          // Guardar los cambios en el producto
          await this.productRepository.save(product);
      }

      // Crear y guardar los nuevos productos asociados a la orden
      const formattedQuantity = this.formatQuantity(productOrderDto.quantity);
      const productOrder = this.productOrderRepository.create({
          order: order,
          product: product,
          quantity: formattedQuantity,
          unidadMedida: productOrderDto.unidadMedida
      });

      await this.productOrderRepository.save(productOrder);
  }

  // Si no hay errores, guardar la orden actualizada
  if (!hasError) {
      const savedOrder = await this.orderRepository.save(order);
      return savedOrder;
  }
}

private async findRelationOrder (id: number)  {
  const order = await this.orderRepository
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.client', 'client')
  .leftJoinAndSelect('order.productOrder', 'productOrder')
  .leftJoinAndSelect('productOrder.product', 'product')
  .where('order.id = :id', { id })
  .getOne();

  return order;
}

private calculateEquivalentQuantity(product: Product, quantity: number, unidadMedida: string): number {
    
  let equivalentQuantity: number;

  const conversionFactor = product.conversionFactors[unidadMedida];
   
  if (conversionFactor !== undefined) {
    
    equivalentQuantity = quantity * conversionFactor;

  } else {
    throw new BadRequestException(`No se encontró un factor de conversión para la unidad de medida '${unidadMedida}' del producto ${product.producto}.`);
  }

  return equivalentQuantity;
}

  async findAll(paginationDto: PaginationDto): Promise<Order[]> {
    const { limit = 5, offset = 0 } = paginationDto;

    const allOrders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.productOrder', 'productOrder')
      .leftJoinAndSelect('productOrder.product', 'product')
      .take(limit)
      .skip(offset)
      .getMany();

    return allOrders;
  }

  async findOne(id: number): Promise<Order> {
 
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.productOrder', 'productOrder')
      .leftJoinAndSelect('productOrder.product', 'product')
      .where('order.id = :id', { id })
      .getOne();

    
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    
  
    return order;
  }

  async findOrderByQuery(querySearchDto: QuerySearchDto) {
    const { search = '' } = querySearchDto;
    try {
      const lowerWord = search.toLowerCase();
      const foundedOrders = await this.orderRepository.createQueryBuilder('order')
        .leftJoinAndSelect('order.client', 'client')
        .where('LOWER(client.nombre) LIKE :search', { search: `%${lowerWord}%` })
        .orWhere('LOWER(client.apellido) LIKE :search', { search: `%${lowerWord}%` })
        .getMany();
    
      if (foundedOrders.length === 0) {
        throw new BadRequestException('No se encontraron órdenes para el cliente proporcionado');
      }
    
      return foundedOrders;
    } catch (error) {
      throw new BadRequestException('No se ha encontrado ningúna Orden')
    }
  }
}



