import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  OrmDatabaseModule,
  OdmDatabaseModule,
  RabbitMQModule,
} from './config/';
import { UserController } from './user/infraestructure/controller/user.controller';
import { AuthController } from './auth/infraestructure/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/infraestructure/strategies/jwt.strategy';
import { ProductController } from './products/infraestructure/controller/product.controller';
import { OrderController } from './order/infraestructure/controller/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10d' },
      }),
    }),
    OrmDatabaseModule,
    OdmDatabaseModule,
    RabbitMQModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ProductController,
    OrderController,
  ],
  providers: [JwtStrategy, AppService],
})
export class AppModule {}
