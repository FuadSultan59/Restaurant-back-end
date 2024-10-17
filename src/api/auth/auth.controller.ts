import { Body, Controller, Post,  UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticateUserDto } from '../Dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor ( private authService: AuthService) {}


    @Post('Signin')
    @UsePipes(ValidationPipe)
    async authenticateUser (@Body() loginData: AuthenticateUserDto) {

        return await this.authService.authenticateUser(loginData)
    }
}
