import { Controller, Post, Body, Get, Patch, UsePipes, ValidationPipe,Req  } from '@nestjs/common';
import { CreateReceptionDto, deleteReceptionDto, updateOrderStatusDto } from '../Dto/reception.dto';
import { ReceptionService } from './reception.service';
import * as jwt from 'jsonwebtoken'

@Controller('reception')
export class ReceptionController {

    constructor ( private receptionService: ReceptionService) {}


    @Post('Create-Reception')
    @UsePipes(ValidationPipe)
    async createUser(@Body() receptionCreateData: CreateReceptionDto, @Req() req:Request) {

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');

        const secretKey = process.env.secretKey;




        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }


        return await this.receptionService.createReception(receptionCreateData);

    }

    @Get('New-Orders')
    async newOrders( @Req() req:Request) {
         

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        return await this.receptionService.newOrders();

    }

    @Get('Accepted-Orders')
    async acceptedOrders( @Req() req:Request) {

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        return await this.receptionService.acceptedOrders();
    }

    @Get('Prepared-Orders')
    async preparedOrders( @Req() req:Request) {

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        return await this.receptionService.preparedOrders();
    }

    @Get('Served-Orders')
    async servedOrders( @Req() req:Request) {

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        return await this.receptionService.servedOrders();
    }

    @Get('Declined-Orders')
    async declinedOrders(@Req() req:Request) {

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }
        return await this.receptionService.declinedOrders();
    }

    @Patch('Set-Order-Status')
    @UsePipes(ValidationPipe)
    async setOrderStatus (@Body() orderStatusUpdateData: updateOrderStatusDto, @Req() req:Request) {

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        return await this.receptionService.setOrderStatus(orderStatusUpdateData)
    }

    @Post('Delete-Reception')
    @UsePipes(ValidationPipe)
    async deleteReception(@Body() receptionDeleteData: deleteReceptionDto, @Req() req: Request){

        const authorizationToken = (req.headers as any).authorization;
        const [ , , token] = authorizationToken.split(' ');

        const secretKey = process.env.secretKey;




        try{
            const response= await jwt.verify(token, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        return await this.receptionService.receptionDelete(receptionDeleteData)
    }



}
