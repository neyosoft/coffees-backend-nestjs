import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string) {
    const transforedValue = parseInt(value, 10);

    if (isNaN(transforedValue)) {
      throw new BadRequestException(
        `Validation failed. "${value}" is not an integer.`,
      );
    }

    return transforedValue;
  }
}
