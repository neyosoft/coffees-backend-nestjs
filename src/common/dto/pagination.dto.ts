import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsPositive()
  @IsOptional()
  readonly size: number = 20;

  @IsPositive()
  @IsOptional()
  readonly page: number = 1;
}
