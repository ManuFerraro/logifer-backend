import { IsEmail, IsString, MinLength } from "class-validator";





export class CreateClientDto {
    
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @MinLength(1)
    apellido: string;
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1)
    direccion: string;
}
