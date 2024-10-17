import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { AdminModule } from './api/admin/admin.module';
import { ReceptionModule } from './api/reception/reception.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './api/config/typeorm.config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [UserModule, 
            AuthModule,
            AdminModule,
            ReceptionModule,
              MulterModule.register({
                dest: './uploads'
              }),
              ServeStaticModule.forRoot({
                serveRoot: '/uploads',
                rootPath: join(__dirname, '..', 'uploads'),
              }),
            ConfigModule.forRoot(), 
            TypeOrmModule.forRoot(typeOrmConfig), 
         ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
