import { Body, Catch, Delete, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, UserDeleteDto, UserInfoDto, UserOrderDto } from '../Dto/user.dto';
import { User } from '../Entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { Order } from '../Entities/order.entity';
import { Dish } from '../Entities/dishes.entity';
import { Response } from 'express';
import * as fs from 'fs';
import { isEmail } from 'class-validator';


@Injectable()
export class UserService {

    constructor
    ( 
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(Dish) private dishRepository: Repository<Dish>

    ) {}

    async createUser(userCreateData: CreateUserDto) 
    {
        const respons ={
            message: '',
            token: null
        }

        const otpGenerator = () => {
            let range ='0123456789'
            let otp=''
            for (let i=1; i<=4; i++){
                otp += range[Math.floor(Math.random()*range.length)]
            }
            return otp;
        }


        try{
                const userEmail = userCreateData.Email;
                const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :userEmail', { userEmail }).getOne();
                
                if (isEmailExist)
                    {
                        
                        respons.message= 'email_exist'
                        return respons
                    }
        
                    else if (!isEmailExist) {

                        const OTP = otpGenerator()
                        userCreateData["otp"] = OTP;
                        userCreateData["Role"] = 'user'
          
                        const token= jwt.sign({userCreateData},process.env.secretKey,{expiresIn: '3m'})

                        respons.message='valid_email'
                        respons.token=token
                        return respons

                    }
                    return respons
                 
             }

        catch {
           
            respons.message='error'
            return respons
        }
       
    }


    async validateUserSignup (decodedtoken, verficationcode)
    {
        const response = {
            message: ''
        }

        const userInfo = decodedtoken.userCreateData
        const otp = userInfo.otp
        const v_code = verficationcode

        if (otp === v_code) {

            // delete otp from userzinfo
            delete userInfo.otp
            try
            {
                const hashedPassword = await argon2.hash(userInfo.Pswrd);
                userInfo.Pswrd=hashedPassword;
                userInfo.Role = 'user'

                const createduser=  this.userRepository.create(userInfo);
                await this.userRepository.save(createduser);
                
   
        
                response.message = 'correct' 
                return response

            }

            catch
            {
    
                response.message = 'error' 
                return response

            }



        }

        else {
           
            response.message = 'incorrect'
            return response
        }
 
        
    }
    

    async userOrder (userOrderData: UserOrderDto, decodedToken){
        
        const response = {
            message: '',
            data: null
        }
        
        const orderedItems = JSON.stringify(userOrderData.Ordered_Meal) 
        const totalPrice = userOrderData.Total_Price

        const userData =decodedToken.isEmailExist

        const order = {
            Ordered_Meal: orderedItems,
            Total_Price: totalPrice,
            Order_Status: 'Pending',
            user: userData

        }

        try {
            const createOrder = this.orderRepository.create(order);
            const OrderedData = await this.orderRepository.save(createOrder);

            response.message = "success"
            response.data = OrderedData
            return response;

        }
        catch {

            response.message = 'error'
            return response

        }


    }


    async fetchUserOrders(decoded) {
        
        const userData = decoded.isEmailExist
        const userID = userData.id

        const response = {
            message: '',
            Orders: null
        }

        try{

            const orders = await this.orderRepository
                .createQueryBuilder('order')
                .where('order.user.id = :userID', { userID })
                .getMany();

            if (!orders) {
              throw new NotFoundException('No_order');
            }

            response.message = 'Success'
            response.Orders= orders

        }
        catch {

            response.message = 'error'
        }       
          
        return response;



    }


    async getDishes(res) {

        const response = {
            message: '',
            dishs: null
        }
      
       


        try {

           const dish= await this.dishRepository.find();
           const fileUrl = 'http://localhost:3232/uploads/'

           dish.map((Foods,index) => 

            Foods.Img_Url = fileUrl + Foods.Img_Url
        
            )           
           
           response.dishs = dish
           response.message = 'success'
            
           res.send(response) 
           
        }
        catch {

            res.send('error')

        }  

    }


    async userInfo(userInfoData: UserInfoDto){


        const email = userInfoData.Email
        const response = {
            message: '',
            data: null
        }

        try {

            const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :email', { email }).getOne();
            
            if (isEmailExist){
                delete isEmailExist.Pswrd

                response.message = 'found'
                response.data = isEmailExist
    
                return response
            }
            else {
                response.message = 'Not_Found'
                return response
            }
        }
        catch {
            response.message = 'error'
            return response
        }



    }
    async userDelete (userDeleteData: UserDeleteDto) {

        const email = userDeleteData.Email
        const Response = {
            message: ''

        }
        try {
            
            const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :email', { email }).getOne();

            if (isEmailExist){

                const Role = isEmailExist.Role
                if (Role === 'user'){
                    await this.userRepository.remove(isEmailExist)
                    Response.message = 'success'
                    return Response
                }

                else if (Role === 'reception'){
                    Response.message = "reception"
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
