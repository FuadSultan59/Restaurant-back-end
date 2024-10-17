import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Order extends BaseEntity  {
    
    
    @PrimaryGeneratedColumn({

        comment: "the user unique identifier",

    })
    id: number;



    @Column({
        type: "text",
    })
    Ordered_Meal: String;



    @Column({
        
        type: "double precision",
        default: null,        
    })
    Total_Price: number;


    @Column({
        type: "text",
    })
    Order_Status: String;


    @CreateDateColumn()
    Ordered_Time: Date;

    @ManyToOne(() => User, user => user.order)
    user: User;



}