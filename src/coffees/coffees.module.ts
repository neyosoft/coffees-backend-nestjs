import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { ConfigModule } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';

@Module({
  providers: [
    CoffeesService,
    { provide: 'COFFEE_BRANDS', useValue: ['buddy brew', 'nescafe'] },
  ],
  controllers: [CoffeesController],
  exports: [CoffeesService],
  imports: [
    ConfigModule.forFeature(coffeeConfig),
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
  ],
})
export class CoffeesModule {}
