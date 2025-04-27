import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forFeature([OdmUserEntityModel, OdmProductEntityModel]),
  ],
  exports: [MongooseModule],
})
export class OdmDatabaseModule {}
