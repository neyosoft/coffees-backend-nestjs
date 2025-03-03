import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';

import { Role } from 'src/user/enums/role.enum';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { Public } from '../common/decorators/public.docorators';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { Roles } from 'src/iam/authorization/decorators/role.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@ApiTags('Coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeessService: CoffeesService) {}

  @Public()
  @Get()
  allCoffees(
    @Query() query: PaginationDTO,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    console.log({ activeUser });
    return this.coffeessService.allCoffess(query);
  }

  @Get(':id')
  @ApiForbiddenResponse({ description: 'Not Found' })
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

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeessService.remove(id);
  }

  @Get(':id/recommend')
  recommendCoffee(@Param('id') id: number) {
    return this.coffeessService.recommendCoffee(id);
  }
}
