import { Body, Controller, Post, Req, Get, Headers, UsePipes, ValidationPipe, Res, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserOrderDto, userSignupValidationDto, UserInfoDto, UserDeleteDto } from '../Dto/user.dto';
import * as jwt from 'jsonwebtoken';


@Controller('user')
export class UserController {
    constructor ( private userService: UserService) {}

    @Post('Create-User')
    @UsePipes(ValidationPipe)
    async createUser(@Body() userCreateData: CreateUserDto) {

        return await this.userService.createUser(userCreateData);

    }
    @Post ('Validate-Signup')
    @UsePipes(ValidationPipe)
    async validateSignup (@Body() validationDto: userSignupValidationDto, @Headers() headers: any, @Req() req: Request)
    {
        const authorizationToken = (req.headers as any).authorization; 
        const secretKey = process.env.secretKey;

        try{
            const response= await jwt.verify(authorizationToken, secretKey);
        }
        catch{

            const respond = { 
                message: 'invalid_token'
            }
            return respond
        }

        const decodedToken = jwt.decode(authorizationToken, secretKey)
        const verficationCode = validationDto.Verfication

        return await this.userService.validateUserSignup(decodedToken, verficationCode );
    }



    @Post('Order')
    @UsePipes(ValidationPipe)
    async userOrder(@Body() userOrderData: UserOrderDto, @Req() req: Request)
    {


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

        const decodedToken = jwt.decode(token,secretKey)


        return await this.userService.userOrder(userOrderData, decodedToken);
    }


    @Get('User-Orders')
    async fetchUserOrder (@Req() req: Request) {
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

        const decoded = jwt.decode(token,secretKey)

        return await this.userService.fetchUserOrders(decoded)



    }


    @Get('Get-Dishes')
    async getDishes (@Res() res:Response) {


        

        return await this.userService.getDishes(res)

    }

    @Post('User-info')
    @UsePipes(ValidationPipe)
    async userInfo(@Body() userInfoData: UserInfoDto, @Req() req: Request){

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


        return await this.userService.userInfo(userInfoData);

    }


    @Post('Delete-User')
    @UsePipes(ValidationPipe)
    async deleteUser(@Body() userDeleteData: UserDeleteDto, @Req() req: Request){
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


        return await this.userService.userDelete(userDeleteData);

    }


    


    }

    

