import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Repository } from 'typeorm';
import { AuthenticateUserDto } from '../Dto/auth.dto';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor (
        @InjectRepository(User) private userRepository: Repository<User>,

    ){}

    async authenticateUser(loginData: AuthenticateUserDto){

        const response = {
            message: '',
            token: null
        }

        const userEmail = loginData.Email;
        const plainPassword = loginData.Pswrd;
        const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :userEmail', { userEmail }).getOne();
        
            if (!isEmailExist)
            {
                response.message = 'Not_Found'
                return response
            }

            const hashedPassword = isEmailExist.Pswrd;

            try {
                const isPasswordCorrect = await argon2.verify(hashedPassword, plainPassword);

                if (isPasswordCorrect)
                {
                    delete isEmailExist.Pswrd 
                    const token= jwt.sign({isEmailExist},process.env.secretKey)

                    response.message = 'success'
                    response.token = token
                    
                    return response

                }
                else {
                    response.message = 'Not_Found'
                    return response
                }


            }

            catch {
                response.message = "Error!"
                return response
            }

    }


}
