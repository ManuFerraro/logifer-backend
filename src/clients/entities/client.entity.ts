import { Order } from "src/orders/entities/order.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity('clients')
export class Client {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    nombre: string;

    @Column({
        type: 'text'
    })
    apellido: string;

    @Column({
        type: 'text',
        unique: true,
    })
    email: string;

    @Column({
        type: 'text'
    })
    direccion: string;

    
    @OneToMany(() => Order, order => order.client, 
    { cascade: true, onDelete: 'CASCADE' }
    )
    orders: Order[];
    
    @BeforeInsert()
    checkFiledsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFiledsBeforeUpdate() {
        this.checkFiledsBeforeInsert();
    }
}
