import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dish extends BaseEntity  {
    
    
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
        default: null
    })
    Description: string;


    @Column({
        
        type: "double precision",
        default: null,        
    })
    Price: number;

    @Column({
        type: "varchar",
    })
    Img_Url: string;


    @Column({
        type: "text",
    })
    Category: string;




}