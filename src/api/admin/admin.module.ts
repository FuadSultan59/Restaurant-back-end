import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Order } from '../Entities/order.entity';
import { Dish } from '../Entities/dishes.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User, Order, Dish])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
