import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
  OrmDatabaseModule,
  OdmDatabaseModule,
  RabbitMQModule,
} from './config/';
import { UserController } from './user/infraestructure/controller/user.controller';
import { AuthController } from './auth/infraestructure/controller/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrmDatabaseModule,
    OdmDatabaseModule,
    RabbitMQModule,
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService],
})
export class AppModule {}
