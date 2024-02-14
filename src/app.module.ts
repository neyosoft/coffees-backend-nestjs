import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRoot({
      port: 5432,
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      synchronize: false,
      autoLoadEntities: true,
      migrationsTableName: 'migrations',
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
