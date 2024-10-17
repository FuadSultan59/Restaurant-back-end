import { Injectable } from '@nestjs/common';
import { CreateReceptionDto, deleteReceptionDto, updateOrderStatusDto } from '../Dto/reception.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Entities/user.entity';
import { Order } from '../Entities/order.entity';
import * as argon2 from 'argon2';
import { UserOrderDto } from '../Dto/user.dto';

@Injectable()
export class ReceptionService {

    constructor
    ( 
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Order) private orderRepository: Repository<Order>,

    ) {}



    async createReception(receptionCreateData: CreateReceptionDto) 
    {
        const respons ={
            message: '',
        }

        try{
                const userEmail = receptionCreateData.Email;
                const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :userEmail', { userEmail }).getOne();
                
        
                    if (!isEmailExist) {

                        const hashedPassword = await argon2.hash(receptionCreateData.Pswrd);
                        receptionCreateData.Pswrd=hashedPassword
                        receptionCreateData["Role"] = "reception"

                        const createduser=  this.userRepository.create(receptionCreateData);
                        await this.userRepository.save(createduser);
                        

                        respons.message='success'
                        return respons

                    }

                    else {
                            
                            respons.message= 'email_exist'
                            return respons
                        }
                 
             }

        catch {
           
            respons.message='error'
            return respons
        }
       
    }

    async newOrders () {

        const response = {
            message: '',
            data: null
        }

        const status = 'Pending'
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        try {

            const newOrder = await this.orderRepository
            .createQueryBuilder( 'Order')
            .leftJoinAndSelect('Order.user', 'User') 
            .where('Order.Order_Status = :status', { status })
            .andWhere('DATE(Order.Ordered_Time) = DATE(:today)', { today }) // Compare dates only
            .getMany();

            if(!newOrder) {
                response.message = 'No_Orders'
                return response
            }

            else {

                const dataArray = []
                newOrder.map((order, index)=>{
                    dataArray.push(order)
                })
                response.message = 'Pending_Orders'
                response.data = dataArray
    
                return response
            
            }
            
        }
        catch{

            response.message = 'error'
            return response

        }




    }

    async acceptedOrders () {

        const response = {
            message: '',
            data: null
        }

        const status = 'Preparing'
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        const preparingOrder = await this.orderRepository
        .createQueryBuilder( 'Order')
        .leftJoinAndSelect('Order.user', 'User') 
        .where('Order.Order_Status = :status', { status })
        .andWhere('DATE(Order.Ordered_Time) = DATE(:today)', { today }) // Compare dates only
        .getMany();

        if(!preparingOrder) {
            response.message = 'no_preparing_order'
            return response
        }

        response.message = 'preparing_orders'
        response.data = preparingOrder

        return response
    }

    async servedOrders () {

        const response = {
            message: '',
            data: null
        }

        const status = 'served'
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        const preparingOrder = await this.orderRepository
        .createQueryBuilder( 'Order')
        .leftJoinAndSelect('Order.user', 'User') 
        .where('Order.Order_Status = :status', { status })
        .andWhere('DATE(Order.Ordered_Time) = DATE(:today)', { today }) // Compare dates only
        .getMany();

        if(!preparingOrder) {
            response.message = 'no_served_orders'
            return response
        }

        response.message = 'served_orders'
        response.data = preparingOrder

        return response
    }



    async declinedOrders () {

        const response = {
            message: '',
            data: null
        }

        const status = 'declined'
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        const declinedOrder = await this.orderRepository
        .createQueryBuilder('Order')
        .leftJoinAndSelect('Order.user', 'User') 
        .where('Order.Order_Status = :status', { status })
        .andWhere('DATE(Order.Ordered_Time) = DATE(:today)', { today }) // Compare dates only
        .getMany();

        if(!declinedOrder) {
            response.message = 'no_declined_order'
            return response
        }

        response.message = 'declined_orders'
        response.data = declinedOrder

        return response

    }



    async preparedOrders () {

        const response = {
            message: '',
            data: null
        }

        const status = 'prepared'
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        const preparedOrders = await this.orderRepository
        .createQueryBuilder('Order')
        .leftJoinAndSelect('Order.user', 'User') 
        .where('Order.Order_Status = :status', { status })
        .andWhere('DATE(Order.Ordered_Time) = DATE(:today)', { today }) // Compare dates only
        // .andWhere('Order.Ordered_Time = :today', {today })
        .getMany();

        if(!preparedOrders) {
            response.message = 'no_prepared_order'
            return response
        }

        response.message = 'prepared_orders'
        response.data = preparedOrders

        return response

    }

    async setOrderStatus(orderStatusUpdateData: updateOrderStatusDto) {

        const respons = {
            message: ''
        }
        const orderID = orderStatusUpdateData.id
        const status = orderStatusUpdateData.status

            const findID = await this.orderRepository.createQueryBuilder('Order').where('Order.id = :orderID', { orderID }).getOne();

            if (!findID){

                respons.message ='error'
                return respons
            }

    

            findID.Order_Status = status

            await this.orderRepository.save(findID)

            respons.message = status
            return respons

    }

    async receptionDelete(receptionDeleteData: deleteReceptionDto){

        const email = receptionDeleteData.Email
        const Response = {
            message: ''

        }
        try {
            
            const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :email', { email }).getOne();

            if (isEmailExist){

                const Role = isEmailExist.Role
                if (Role === 'user'){
                    Response.message = "user"
                    return Response
                }

                else if (Role === 'reception'){  

                    await this.userRepository.remove(isEmailExist)
                    Response.message = 'success'
                    return Response

                }
                else if (Role === 'admin') {
                    Response.message = 'admin'
                    return Response
                }
                else {
                    Response.message = 'error'
                    return
                }

            }
            else {

                Response.message = 'Not_Found'
                return Response
            }

        }
        catch {
            Response.message = 'error'
            return 
        }

    }
}
