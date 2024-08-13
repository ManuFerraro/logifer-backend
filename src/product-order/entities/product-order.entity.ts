import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class ProductOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.productOrder)
    order: Order;

    @ManyToOne(() => Product, product => product.productOrder)
    product: Product;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantity: number;
    
    @Column({ type: 'text' })
    unidadMedida: string;
}
