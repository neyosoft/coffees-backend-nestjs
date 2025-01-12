import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDTO {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
