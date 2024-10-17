import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto 
{
        @IsNotEmpty({message: 'Fill All Fields'})
        Name: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        @IsEmail({}, {message: 'invalid Email!'})
        Email: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Phone: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Pswrd: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Address: string;


}

export class userSignupValidationDto {

        @IsNotEmpty( {message: 'Fill The Field'})
        Verfication: number;
}


export class UserOrderDto
{

        Ordered_Meal: String;

        Total_Price: number;

}

export class UserInfoDto 
{
        @IsEmail({}, {message: 'invalid Email!'})
        @IsNotEmpty({message: 'Fill The Field'})
        Email: string;    
}

export class UserDeleteDto
{
        @IsEmail({}, {message: 'invalid Email!'})
        @IsNotEmpty({message: 'Fill The Field'})
        Email: string;    
}
