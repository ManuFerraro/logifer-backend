import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsServices')
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}



 
  async create(createProductDto: CreateProductDto) {
    const { producto, conversionFactors, ...rest } = createProductDto;
    try {
        const productFounded = await this.productRepository.findOne({ where: { producto: producto } });
        if (productFounded) {
            throw new BadRequestException('El producto ya existe');
        }

        if (conversionFactors) {
            // Validar los factores de conversión
            if (!this.isValidConversionFactors(conversionFactors)) {
                throw new BadRequestException('Los factores de conversión no son válidos');
            }
        }

        const createProduct = this.productRepository.create({
            ...rest,
            producto,
            conversionFactors, // Incluye conversionFactors si está presente
        });

        await this.productRepository.save(createProduct);
        return createProduct;
    } catch (error) {
        throw this.handleExceptions(error);
    }
}

// Función para validar los factores de conversión
private isValidConversionFactors(conversionFactors: { [unidad: string]: number }): boolean {
    for (const factor of Object.values(conversionFactors)) {
        if (typeof factor !== 'number' || factor <= 0) {
            return false;
        }
    }
    return true;
}


  async findAll() {
    const allProducts= await this.productRepository.find();

    return allProducts;
  }

  async findOne(id: number) {
    try {
      const productFounded = await this.productRepository.findOne({
        where: { id: id }
      })
      if (!productFounded) {
          throw new BadRequestException('Producto no encontrado')
      }
      return productFounded;
    } catch (error) {
      throw this.handleExceptions(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
     const { stock } = updateProductDto;
    try {
      const productFound = await this.productRepository.findOne({ where: { id: id}})

      if (!productFound) {
         throw new BadRequestException('No se encontró el producto')
      }
      productFound.stock += stock

      await this.productRepository.save(productFound)
      return productFound;
    } catch (error) {
      throw this.handleExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleExceptions( error: any ): never {
    if( error.code === '23505' ) {
      throw new BadRequestException(error.detail)
    } 

    this.logger.error(error)

    throw new BadRequestException(error)
  }
}
