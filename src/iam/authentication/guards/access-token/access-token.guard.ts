import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../../iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Whoa there! It looks like you forgot to bring your token. Please log in to join the fun!',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfigration);
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(
        'Oops! That token didn’t pass the bouncer. Please log in to get a new one!',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.authorization?.split(' ')[1];
    return token;
  }
}
