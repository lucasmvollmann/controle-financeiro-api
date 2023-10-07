import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { AccountsService } from '../accounts.service';

export class AccountId implements PipeTransform {
  @Inject(AccountsService)
  private readonly accountsService: AccountsService;

  async transform(value: any, metadata: ArgumentMetadata): Promise<number> {
    if (isNaN(value)) {
      throw new BadRequestException('Parâmetro ID inválido.');
    }

    const accountExists = await this.accountsService.exists(+value);
    if (!accountExists)
      throw new NotFoundException('Conta informada não existe.');

    return value;
  }
}
