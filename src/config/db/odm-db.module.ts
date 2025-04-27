import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OdmOrderItemEntityModel } from 'src/order/infraestructure/entities/order-item/odm-order-item.entity';
import { OdmOrderEntityModel } from 'src/order/infraestructure/entities/order/odm-order.entity';
import { OdmProductEntityModel } from 'src/products/infraestructure/entities';
import { OdmUserEntityModel } from 'src/user/infraestructure/entities/odm-entities/odm-user.entity';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
        authSource: configService.get<string>('MONGO_AUTH_SOURCE'),
      }),
    }),
    MongooseModule.forFeature([
      OdmUserEntityModel,
      OdmProductEntityModel,
      OdmOrderEntityModel,
      OdmOrderItemEntityModel,
    ]),
  ],
  exports: [MongooseModule],
})
export class OdmDatabaseModule {}
