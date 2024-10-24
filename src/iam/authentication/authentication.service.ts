import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Model } from 'mongoose';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
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
      return { message: 'Welcome!' };
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

    // TODO: Generate Access Token, Refresh Token
    return true;
  }
}
