import { IsEmail, IsNotEmpty } from "class-validator";


export class AuthenticateUserDto 
{
        @IsEmail({}, {message: 'invalid Email!'})
        @IsNotEmpty({message: 'Fill All Fields'})
        Email: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Pswrd: string;



}