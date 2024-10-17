import { IsEmail, IsNotEmpty } from "class-validator";


export class CreateReceptionDto 
{
        @IsNotEmpty({message: 'Fill All Fields'})
        Name: string;

        @IsEmail({}, {message: 'invalid Email!'})
        @IsNotEmpty({message: 'Fill All Fields'})
        Email: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Phone: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Pswrd: string;

        @IsNotEmpty({message: 'Fill All Fields'})
        Address: string;


}


export class updateOrderStatusDto {

    @IsNotEmpty({message: 'Error Select order first!'})
    status: string

    @IsNotEmpty({message: 'Error, Error Select order first!'})
    id: number
} 

export class deleteReceptionDto
{
    @IsEmail({}, {message: 'invalid Email!'})
    @IsNotEmpty({message: 'Fill All Fields'})
    Email: string;

}