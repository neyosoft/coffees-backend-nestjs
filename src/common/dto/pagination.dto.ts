import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsPositive()
  @IsOptional()
  readonly size: number;

  @IsPositive()
  @IsOptional()
  readonly page: number;
}
