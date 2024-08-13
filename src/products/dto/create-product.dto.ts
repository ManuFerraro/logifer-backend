import { IsArray, IsInt, IsJSON, IsNumber, IsOptional, IsPositive, IsString, MinLength, Validate } from "class-validator";



// function isValidConversionFactors(value: any): boolean {
//     if (!value || typeof value !== 'object') {
//         return false;
//     }

//     // Verifica si todos los valores son números positivos
//     for (const key in value) {
//         if (typeof value[key] !== 'number' || value[key] <= 0) {
//             return false;
//         }
//     }

//     return true;
// }

export class CreateProductDto {
     
    @IsString()
    @MinLength(1)
    producto: string;
     
    @IsString({ each: true })
    @IsArray()
    unidadMedida: string[];
     
    @IsNumber()
    @IsPositive()
    price: number;
    
    @IsInt()
    @IsPositive()
    stock: number;

    @IsOptional()
    conversionFactors?: { [unidad: string]: number };
}
