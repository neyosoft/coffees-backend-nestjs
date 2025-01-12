import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDTO } from './dto/sign-in';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enums';
import { RefreshTokenDTO } from './dto/refresh-token';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: SignInDTO) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() signUpDto: SignInDTO) {
    return this.authService.register(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('token/refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDTO) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
