import { Module } from '@nestjs/common';

import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';

@Module({
  providers: [CoffeesService],
  controllers: [CoffeesController],
})
export class CoffeesModule {}
