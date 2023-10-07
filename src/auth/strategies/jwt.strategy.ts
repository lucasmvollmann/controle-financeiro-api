import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    console.log('SecretJwtStrategy', process.env.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload /*: UserPayload*/) /*: Promise<UserFromJwt>*/ {
    const userId = payload.sub;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
