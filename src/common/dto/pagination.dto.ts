import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsPositive()
  @IsOptional()
  readonly perPage: number;

  @IsPositive()
  @IsOptional()
  readonly currentPage: number;
}
