import { IsString } from 'class-validator';

export class CreateCoffeeEvent {
  @IsString()
  readonly coffeeId: number;
}
