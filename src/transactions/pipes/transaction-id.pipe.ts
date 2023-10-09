import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TransactionsService } from '../transactions.service';

export class TransactionId implements PipeTransform {
  @Inject(TransactionsService)
  private readonly transactionsService: TransactionsService;

  async transform(value: any, metadata: ArgumentMetadata): Promise<number> {
    if (isNaN(value)) {
      throw new BadRequestException('Parâmetro ID inválido.');
    }

    const transactionExists = await this.transactionsService.exists(+value);
    if (!transactionExists) {
      throw new NotFoundException('Categoria informada não existe.');
    }

    return value;
  }
}
