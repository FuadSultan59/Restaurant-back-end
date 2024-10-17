import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Order } from '../Entities/order.entity';
import { Dish } from '../Entities/dishes.entity';

@Module({

    imports: [TypeOrmModule.forFeature([User, Order, Dish])],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
