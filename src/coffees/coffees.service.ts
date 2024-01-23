import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';

@Injectable()
export class CoffeesService {
  private list: Coffee[] = [];
  private id = 0;

  allCoffess() {
    console.log('Got here...');
    return this.list;
  }

  findOne(id: number | string) {
    const item = this.list.find((record) => record.id === Number(id));

    console.log({ id, item });

    if (!item) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    return item;
  }

  createCoffee(newCoffee: CreateCoffeeDto) {
    this.list.push({ id: ++this.id, ...newCoffee });

    return 'New coffee created';
  }

  updateCoffee(id: number, update: UpdateCoffeeDto) {
    const item = this.findOne(id);

    console.log('update: ', update);

    return update;
  }

  remove(id: number) {
    const itemIndex = this.list.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    this.list.splice(itemIndex, 1);

    return 'Item successfully deleted';
  }
}
