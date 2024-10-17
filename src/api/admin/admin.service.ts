import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../Entities/user.entity';
import { Order } from '../Entities/order.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { AddDishDto, CreateAdminDto, DeleteDishDto, DishInfoDto, UpdateDishDto } from '../Dto/admin.dto';
import * as argon2 from 'argon2';
import { Dish } from '../Entities/dishes.entity';


@Injectable()
export class AdminService {

    constructor
    ( 
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(Dish) private dishRepository: Repository<Dish>

    ) {}


    async createAdmin (createAdminData: CreateAdminDto) {


      const respons ={
                message: '',
            }
    
            try{
                    const userEmail = createAdminData.Email;
                    const isEmailExist = await this.userRepository.createQueryBuilder('User').where('User.Email = :userEmail', { userEmail }).getOne();
                    
            
                        if (!isEmailExist) {
    
                            const hashedPassword = await argon2.hash(createAdminData.Pswrd);
                            createAdminData.Pswrd=hashedPassword
                            createAdminData["Role"] = "admin"
    
                            const createdAdmin=  this.userRepository.create(createAdminData);
                            await this.userRepository.save(createdAdmin);
                            
    
                            respons.message='success'
                            return respons
    
                        }
    
                        else {
                                const asRoleOf = isEmailExist.Role
                                respons.message= 'email_exist'
                                return respons
                            }
                     
                 }
    
            catch {
               
                respons.message='error'
                return respons
            }
           
        
    }


    async createDish( addDishData ) {
        
        const response = {
            message: ''
        }

        try {
        const dishName = addDishData.Name
        const isDishExist = await this.dishRepository
            .createQueryBuilder('Dish')
            .where('Dish.Name = :dishName', { dishName })
            .getOne();

            if (!isDishExist) {

                const addDish=  this.dishRepository.create(addDishData);
                await this.dishRepository.save(addDish);

                response.message = "success"
                return response

            }

            else {

                response.message = "Already Exist"
                return response
            }

        }
        catch {
            response.message = "error"
        }

    }

    
    async updateDish (updateDishData: UpdateDishDto) {

        const response = {
            message: ''
        }

        try {
        const updateDishName = updateDishData.Name
        const updateDishExist = await this.dishRepository
            .createQueryBuilder('Dish')
            .where('Dish.Name = :dishName', { updateDishName })
            .getOne();

        if (updateDishExist) {
             
            Object.assign(updateDishExist, updateDishData)

            await this.dishRepository.save(updateDishExist)

            response.message = "success"
            return response
        }

        else {
            response.message = 'Dish Not Found!'
            return response       
        }
    }
    catch {
        response.message = 'error'
        return response
    }

    }

    async deleteDish(deleteDishData: DeleteDishDto){

        const foodName = deleteDishData.Name
        const response = {
            message: '',
        }

        try {
            const deleteDish = await this.dishRepository
            .createQueryBuilder('Dish')
            .where('Dish.Name = :foodName', { foodName })
            .getOne();


            if (deleteDish){
                await this.dishRepository.remove(deleteDish)
                response.message = 'success'
                return response


            }
            else {
                response.message = 'Not_Found'
                return response;
            }

        }
        catch {
            response.message = 'error'
            return response
        }

    }

    async dishInfo(dishInfoData: DishInfoDto){
        const dishName = dishInfoData.Name
        const response = {
            message:'',
            data: null
        }

        try{
            const foodInfo = await this.dishRepository
            .createQueryBuilder('Dish')
            .where('Dish.Name = :dishName', {dishName})
            .getOne()

            if (foodInfo){
                response.message = 'success'
                response.data = foodInfo

                return response
            }
            else{
                response.message = 'Not_Found'
                return response
            }

        }
        catch{
            response.message = 'error'
            return response
        }

    }



    async orderAnalysis(){

        const response = {
            message: '',
            data: null
        }

        try{

            const TotalOrderResult = await this.orderRepository
                .createQueryBuilder('Order')  // Start building a query on the 'order' entity/table
                .select('EXTRACT(MONTH FROM Order.Ordered_Time)', 'month')  // Select the month from the orderDate
                .addSelect('COUNT(Order.id)', 'count')  // Count the number of orders (by id) for each month
                .groupBy('month')  // Group the results by month
                .orderBy('month', 'ASC')  // Order the results by month in ascending order
                .getRawMany();  // Execute the query and get the raw result set as an array
                

            const DeclinedOrderResult = await this.orderRepository
                .createQueryBuilder('Order')
                .select('EXTRACT(MONTH FROM Order.Ordered_Time)', 'month')
                .addSelect('COUNT(Order.id)', 'declinedcount')
                .where('Order.Order_Status = :status', { status: 'declined' })
                .groupBy('month')
                .orderBy('month', 'ASC')
                .getRawMany();
              

                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ];
                  
                //   Map over the query result to transform month numbers to month names
                const transformedTotalResult = TotalOrderResult.map(item => ({
                    month: monthNames[parseInt(item.month) - 1], // Subtract 1 because JavaScript arrays are zero-indexed
                    count: item.count
                }));


                // Map over the query result to transform month numbers to month names
                const transformedDeclinedResult = DeclinedOrderResult.map(item => ({
                    month: monthNames[parseInt(item.month) - 1], // Subtract 1 because JavaScript arrays are zero-indexed
                    declinedcount: item.declinedcount
                }));

                const mergedData = transformedTotalResult.map(({ month, count }, i) => ({
                    month,
                    count,
                    declinedcount: transformedDeclinedResult[i].declinedcount,
                    accepted: count - transformedDeclinedResult[i].declinedcount
                }));
                  
                  response.message = 'success'
                  response.data = mergedData 

                  return response

        
    }
    catch(error) {

        response.message = "error"
        return response
    }

}
}
