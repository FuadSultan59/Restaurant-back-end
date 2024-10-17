import { IsEmail, IsNotEmpty } from "class-validator";


export class CreateAdminDto 
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

export class AddDishDto 
{
    @IsNotEmpty({message: 'Fill Food-Name '})
    Name: string;

    @IsNotEmpty({message: 'Fill Description'})
    Description: string;

    @IsNotEmpty({message: 'Fill Price'})
    Price: number;


    @IsNotEmpty({message: 'Fill All Fields'})
    Category:string;
}

export class UpdateDishDto
{

    @IsNotEmpty({message: 'Fill All Fields'})
    Name: string;

    @IsNotEmpty({message: 'Fill All Fields'})
    Description: string;

    @IsNotEmpty({message: 'Fill All Fields'})
    Price: number;

    @IsNotEmpty({message: 'Fill All Fields'})
    category:string;

}

export class DeleteDishDto
{
    @IsNotEmpty({message: 'Fill The Field'})
    Name: string;

}

export class DishInfoDto
{
    @IsNotEmpty({message: 'Please Enter Dish Name'})
    Name: string;
}