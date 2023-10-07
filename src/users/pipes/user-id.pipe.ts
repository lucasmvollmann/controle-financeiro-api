import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  PipeTransform,
} from '@nestjs/common';
import { UsersService } from '../users.service';

export class UserId implements PipeTransform {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  async transform(value, metadata: ArgumentMetadata): Promise<number> {
    if (isNaN(value)) {
      throw new BadRequestException('Parâmetro ID inválido.');
    }

    const userExists = await this.usersService.exists(+value);
    if (!userExists) {
      throw new BadRequestException('Usuário informado não existe.');
    }

    return value;
  }
}
