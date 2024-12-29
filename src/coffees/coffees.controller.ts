import { ConfigService, ConfigType } from '@nestjs/config';
import {
  Body,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  Inject,
  Controller,
} from '@nestjs/common';

import coffeeConfig from './config/coffee.config';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { Public } from 'src/common/decorators/public.docorators';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeessService: CoffeesService,
    private readonly configService: ConfigService,
    @Inject('COFFEE_BRAND') coffeeBrands: string[],
    @Inject(coffeeConfig.KEY)
    private readonly coffeeConfiguration: ConfigType<typeof coffeeConfig>,
  ) {
    console.log(
      'Database host:',
      this.configService.get<string>('DATABASE_HOST'),
    );
    console.log('Database PORT:', this.configService.get('database.port'));
    console.log('coffeeBrands:', coffeeBrands);
    console.log('FooBar:', coffeeConfiguration.foo);
  }

  @Public()
  @Get()
  allCoffees(protocol: string, @Query() query: PaginationDTO) {
    return this.coffeessService.allCoffess(query);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
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

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeessService.remove(id);
  }

  @Get(':id/recommend')
  recommendCoffee(@Param('id') id: number) {
    return this.coffeessService.recommendCoffee(id);
  }
}
