import { DataSource, Repository } from 'typeorm';
import {
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

import { Event } from './entities/event.entity';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create.coffee.dto';
import { UpdateCoffeeDto } from './dto/update.coffee.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: DataSource,
  ) {
    console.log('Inside the coffee service');
  }

  async allCoffess(query: PaginationDTO) {
    return this.coffeeRepository.find({
      relations: ['flavors'],
      take: query.size,
      skip: (query.page - 1) * query.size,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });

    if (!coffee) {
      throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
    }

    return coffee;
  }

  async createCoffee(newCoffee: CreateCoffeeDto) {
    const flavors = await Promise.all(
      newCoffee.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({ ...newCoffee, flavors });

    return this.coffeeRepository.save(coffee);
  }

  async updateCoffee(id: number, update: UpdateCoffeeDto) {
    const flavors = await Promise.all(
      update.flavors?.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = await this.coffeeRepository.preload({
      id,
      ...update,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException('Coffee not found.');
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);

    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffeeId: number) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const coffee = await this.findOne(coffeeId);

      coffee.recommendations++;

      const recommendEvent = new Event();

      recommendEvent.type = 'coffee';
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.payload = { coffee: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return 'Coffee has been recommended';
  }

  private async preloadFlavorByName(name: string) {
    const flavor = await this.flavorRepository.findOneBy({ name });

    if (flavor) {
      return flavor;
    } else {
      const newflavour = this.flavorRepository.create({ name });

      return this.flavorRepository.save(newflavour);
    }
  }
}
