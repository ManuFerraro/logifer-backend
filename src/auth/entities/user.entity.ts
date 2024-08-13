import { Notification } from "src/notification/entities/notification.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
    })
    email: string;

    @Column({
        type: 'text',
        select: false,
    })
    password: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[]

    @BeforeInsert()
    checkFiledsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFiledsBeforeUpdate() {
        this.checkFiledsBeforeInsert();
    }
}   