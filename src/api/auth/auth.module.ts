import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Order } from '../Entities/order.entity';
import { Dish } from '../Entities/dishes.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User, Order, Dish])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
