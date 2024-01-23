import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeessService: CoffeesService) {}

  @Get()
  index() {
    return this.coffeessService.allCoffess();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.coffeessService.findOne(id);
  }

  @Post()
  create(@Body() newCoffee: CreateCoffeeDto) {
    return this.coffeessService.createCoffee(newCoffee);
  }

  @Get(':id')
  getDetails(@Param('id') id: number) {
    return this.coffeessService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffee: UpdateCoffeeDto) {
    return this.coffeessService.updateCoffee(id, updateCoffee);
  }
}
