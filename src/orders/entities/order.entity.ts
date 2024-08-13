import { Client } from "src/clients/entities/client.entity";
import { ProductOrder } from "src/product-order/entities/product-order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity({name: 'orders'})
export class Order {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        nullable: false, 
        name: 'client_id',
    })
    clientId: number;

    @Column({
        type: 'text'
    })
    direccionDeEnvio: string;

    @Column({
        type: 'text',
        default: 'pending'
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ 
        type: 'date', 
        nullable: true 
    })
    deliveryDate: Date | null;

    @ManyToOne(() => Client, client => client.orders)
    @JoinColumn({ name: 'client_id', referencedColumnName: 'id'})
    client: Client;
    
    @OneToMany(() => ProductOrder, productOrder => productOrder.order,  { cascade: true })
    productOrder: ProductOrder[];
  
}



