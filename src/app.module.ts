import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrmDatabaseModule } from './config/db/orm-db.module';
import { OdmDatabaseModule } from './config/db/odm-db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrmDatabaseModule,
    OdmDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
