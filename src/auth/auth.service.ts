import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/utils/helpers/password.helper';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatchPassword = await this.passwordHelper.verify(
        user.password,
        password,
      );

      if (isMatchPassword) {
        return user;
      }
    }

    throw new UnauthorizedException('E-mail ou senha incorretos');
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      name: user.name,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signUpDto: SignUpDto) {
    return this.usersService.create(signUpDto);
  }
}