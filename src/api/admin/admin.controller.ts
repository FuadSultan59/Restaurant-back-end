import { Controller, Post, Body, Req, Patch, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { AddDishDto, CreateAdminDto, DeleteDishDto, DishInfoDto, UpdateDishDto } from '../Dto/admin.dto';
import { AdminService } from './admin.service';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';


@Controller('admin')
export class AdminController {

    constructor ( private adminService: AdminService) {}


@Post('Create-Admin')
@UsePipes(ValidationPipe)
async createAdmin (@Body() adminCreateData: CreateAdminDto, @Req() req: Request) {

        const authorizationToken = (req.headers as any).authorization;
        const secretKey = process.env.secretKey;

        const response = {
            message: ''
        }

        try {
            const tokenVerify =await jwt.verify(authorizationToken, secretKey)

        }
        catch {

            response.message = 'invalid_token'

        }

    return await this.adminService.createAdmin(adminCreateData)
}


@Post('Add-Dish') 
@UseInterceptors(FileInterceptor('Img_Url',{
     storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {

        const randomName = Date.now()
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${path.extname(file.originalname)}`)
      }

}

)
}))
@UsePipes(ValidationPipe)
async addDish (@UploadedFile() file:Express.Multer.File, @Body() addDishData: AddDishDto, ) {

    addDishData['Img_Url'] = file.filename

    return await this.adminService.createDish(addDishData)

}

@Patch ('Update-Dish')
async updateDish (@Body() updateDishData: UpdateDishDto, @Req() req: Request ) {

    const authorizationToken = (req.headers as any).authorization;
    const secretKey = process.env.secretKey;

    const response = {
        message: ''
    }

    try {
        const tokenVerify =await jwt.verify(authorizationToken, secretKey)

    }
    catch {

        response.message = 'invalid_token'

    }

    return await this.adminService.updateDish (updateDishData)

}

@Post('Delete-Dish')
@UsePipes(ValidationPipe)
async deleteDish (@Body() deleteDishData: DeleteDishDto, @Req() req: Request){
    
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

    return await this.adminService.deleteDish(deleteDishData)
}

@Post('Dish-Info')
@UsePipes(ValidationPipe)
async dishInfo(@Body() dishInfoData: DishInfoDto, @Req() req:Request ){
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

    return await this.adminService.dishInfo(dishInfoData)
}


@Get('Order-Analysis')
async OrderAnalysis( @Req() req:Request) {
     

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

    return await this.adminService.orderAnalysis();

}


}
