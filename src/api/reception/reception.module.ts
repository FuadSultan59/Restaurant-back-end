import { Module } from '@nestjs/common';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './reception.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Order } from '../Entities/order.entity';
import { Dish } from '../Entities/dishes.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User, Order, Dish])],
  controllers: [ReceptionController],
  providers: [ReceptionService]
})
export class ReceptionModule {}
