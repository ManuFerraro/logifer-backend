import { Transform, Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDate, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, Validate, ValidateNested, ValidationArguments  } from "class-validator";





export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    clientId: number;
    
    @IsOptional()
    @IsString()
    @Validate((value: string) => {
        if (value !== 'pending' && value !== 'success') {
            throw new Error('El campo status debe ser "pending" o "success"');
        }
    })
    status?: string;

    @IsNotEmpty()
    @IsString()
    direccionDeEnvio: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : null))
    deliveryDate?: Date | null;


    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductOrderDto)
    productOrder: ProductOrderDto[];
}

export class ProductOrderDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @Validate(isValidQuantity, {
        message: 'quantity must be a valid decimal number or integer',
    })
    quantity: number;

    @IsNotEmpty()
    @IsString()
    unidadMedida: string; 
}

function isValidQuantity(value: any, args: ValidationArguments) {
    const isValidDecimal = typeof value === 'number' && !isNaN(value);
    const isValidInteger = Number.isInteger(value);
    return isValidDecimal || isValidInteger;
}