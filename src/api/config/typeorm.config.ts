import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { User } from "../Entities/user.entity"
import { Dish } from "../Entities/dishes.entity"
import { Order } from "../Entities/order.entity"


export const typeOrmConfig: TypeOrmModuleOptions = {

    
    type: 'postgres',

    host: 'localhost',

    port: 5432,

    username: 'postgres',

    password: '1313',

    database: 'Hotel',

    entities: [User,Dish,Order],

    synchronize: true,
    


}