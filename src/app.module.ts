import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';
import { IamModule } from './iam/iam.module';
import { UserModule } from './user/user.module';
import { configValidator } from './common/validators/config.validators';

@Module({
  imports: [
    CoffeesModule,
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: configValidator,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        autoLoadEntities: true,
        migrationsTableName: 'migrations',
      }),
    }),
    CoffeeRatingModule,
    CommonModule,
    IamModule,
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
