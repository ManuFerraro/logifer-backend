import { User } from "src/auth/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";




@Entity('Notifications')
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    message: string;

    @Column({
        type: 'text'
    })
    type: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({
        nullable: false, 
        name: 'user_id',
    })
    userId: number;

    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'user_id',  referencedColumnName: 'id' })
    user: User;
}
