import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  async singUp(signUpDto: SignUpDto) {
    try {
      const hashedPassword = await this.hashingService.hash(signUpDto.password);

      const user = new this.userModel({
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      });

      await user.save();
      return { message: 'User registered successfully!' };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw new Error('An error occurred during sign-up');
    }
  }

  async signIn(signIpDto: SignInDto) {
    const user = await this.userModel.findOne({ email: signIpDto.email });

    if (!user || !(await this.hashingService.compare(signIpDto.password, user.password))) {
      throw new UnauthorizedException(
        'Oops! We couldn’t log you in. Please check your email and password, and try again.',
      );
    }

    const tokens = await this.generateTokens(user);
    return { message: 'Signin successful.', ...tokens };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfigration.secret,
          issuer: this.jwtConfigration.issuer,
          audience: this.jwtConfigration.audience,
        },
      );

      const user = await this.userModel.findById(sub);
      const tokens = await this.generateTokens(user);
      return { message: 'Token refreshed successfully', ...tokens };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfigration.accessTokenTtl, {
        email: user.email,
      }),
      this.signToken(user.id, this.jwtConfigration.refreshTokenTtl),
    ]);

    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: string, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfigration.secret,
        issuer: this.jwtConfigration.issuer,
        audience: this.jwtConfigration.audience,
        expiresIn: expiresIn,
      },
    );
  }
}
