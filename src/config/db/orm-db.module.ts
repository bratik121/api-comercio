import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmOrderItemEntity } from 'src/order/infraestructure/entities/order-item';
import { OrmOrderEntity } from 'src/order/infraestructure/entities/order/orm-order.entity';
import { OrmProductEntity } from 'src/products/infraestructure/entities';

import { OrmUserEntity } from 'src/user/infraestructure/entities/orm-entities/orm-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_DB_PORT') || 5432,
        username: configService.get<string>('PG_DB_USER'),
        password: configService.get<string>('PG_DB_PASSWORD'),
        database: configService.get<string>('PG_DB_NAME'),
        schema: configService.get<string>('PG_DB_SCHEMA'),
        entities: [
          OrmUserEntity,
          OrmProductEntity,
          OrmOrderEntity,
          OrmOrderItemEntity,
        ],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrmDatabaseModule {}
