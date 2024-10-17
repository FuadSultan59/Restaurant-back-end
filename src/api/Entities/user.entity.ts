import { BaseEntity, Column, CreateDateColumn, OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class User extends BaseEntity  {
    
    
    @PrimaryGeneratedColumn({

        comment: "the user unique identifier",

    })
    id: number;



    @Column({
        type: "text",
    })
    Name: string;



    @Column({
        
        type: "varchar",
        default: null,        
    })
    Email: string;

    @Column({
        
        type: "varchar",
        default: null,        
    })
    Phone: string;



    @Column({
        type: "varchar",
    })
    Pswrd: string;


    @Column ({
        type: 'text',
        default: 'user'
    })
    Role: String;


    @Column ({
        type: 'varchar',
    })
    Address: String;


    @CreateDateColumn()
    CreatedAt: Date;


    @OneToMany(() => Order, order => order.user)
    order: Order[];



}