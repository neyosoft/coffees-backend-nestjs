import {
  Inject,
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignInDTO } from './dto/sign-in';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDTO } from './dto/refresh-token';
import { RedisService } from 'src/common/redis/redis.service';
import { randomUUID } from 'crypto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly hashingService: HashingService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async login(loginDto: SignInDTO) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    const tokens = await this.generateToken(user);

    const redis = this.redisService.getInstance();
    await redis.set(
      tokens.refreshToken,
      tokens.accessToken,
      'EX',
      60 * this.jwtConfiguration.refreshTokenExpiresIn,
    );

    return tokens;
  }

  private async generateToken(user: User) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.expiresIn, {
        email: user.email,
        role: user.role,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenExpiresIn, {
        refreshTokenId,
      }),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  async signToken<T>(userId: number, expiresIn: string | number, data: T) {
    return await this.jwtService.signAsync(
      { sub: userId, ...data },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        expiresIn,
      },
    );
  }

  async register(signUpDto: SignInDTO) {
    try {
      const user = new User();

      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.userRepository.save(user);

      return true;
    } catch (error) {
      const pgUniqueViolation = '23505';
      if (error.code === pgUniqueViolation) {
        throw new HttpException('User already exists', 409);
      }

      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDTO) {
    try {
      const {
        sub,
        refreshTokenId,
      }: ActiveUserData & { refreshTokenId: string } =
        await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.secret,
        });

      const user = await this.userRepository.findOneOrFail({
        where: { id: sub },
      });

      const isValid = await this.refreshTokenIdsStorage.validate(
        sub,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(sub);
      } else {
        throw new Error('Invalid refresh token');
      }

      return this.generateToken(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      throw new UnauthorizedException();
    }
  }
}
