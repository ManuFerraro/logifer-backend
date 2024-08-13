import { IsString } from "class-validator";





export class QuerySearchDto {

        @IsString()
        search?: string;
}