import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';

@Module({
  providers: [CoffeesService],
  controllers: [CoffeesController],
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
})
export class CoffeesModule {}
