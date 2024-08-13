import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity({ name: 'products'})
export class Product {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        unique: true,
    })
    producto: string

    @Column({
        type: 'text',
        array: true,
    })
    unidadMedida: string[];

    @Column({
        type: 'jsonb', // Usa el tipo jsonb para almacenar un objeto JSON en la base de datos
        nullable: true,
    })
    conversionFactors: { [unidad: string]: number }; 
    
    @Column({
        type: 'float',
        default: 0,
    })
    price: number;
    
    @Column({
        type: 'float',
        default: 0,
    })
    stock: number;

    @OneToMany(() => ProductOrder, productOrder => productOrder.product, { cascade: true })
    productOrder: ProductOrder[];
}
