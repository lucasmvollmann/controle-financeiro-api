import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryType } from 'src/categories/enums/category-type.enum';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { DateHelper } from 'src/utils/helpers/date.helper';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateHelper: DateHelper,
  ) {}

  async create(user_id: number, createTransactionDto: CreateTransactionDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: createTransactionDto.account_id },
      include: { account_member: true },
    });

    if (!account) throw new BadRequestException('Conta informada não existe.');

    const userHasAccountAcess = account.account_member.some(
      (member) => member.user_id == user_id,
    );

    if (!userHasAccountAcess) {
      throw new BadRequestException(
        'Usuário não possui acesso a conta informada.',
      );
    }

    const category = await this.prisma.category.findFirst({
      where: { id: createTransactionDto.category_id },
    });

    if (!category)
      throw new BadRequestException('Categoria informada não existe.');

    if (category.user_id != user_id)
      throw new BadRequestException(
        'Usuário não possui acesso a categoria informada.',
      );

    if (category.type != CategoryType.Transaction)
      throw new BadRequestException('Categoria deve ser do tipo Transação.');

    const data = { ...createTransactionDto, user_id };

    return this.prisma.transaction.create({ data });
  }

  findAll(user_id: number, query: QueryTransactionDto) {
    let year: number;
    let startDate: Date;
    let endDate: Date;

    if (query.month) {
      year = query.year ? query.year : new Date().getFullYear();
      startDate = this.dateHelper.getFirstDayOfMonth(query.month, year);
      endDate = this.dateHelper.getLastDayOfMonth(query.month, year);
    }

    const where = {
      where: {
        account_id: query.account_id,
        category_id: query.category_id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        user_id: user_id,
      },
    };

    console.log(where);

    return this.prisma.transaction.findMany(where);
  }

  async findOne(user_id: number, transaction_id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transaction_id },
      include: { account_member: true },
    });

    if (transaction.account_member.user_id != user_id)
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar transação.',
      );

    delete transaction.account_member;

    return transaction;
  }

  async update(
    user_id: number,
    transaction_id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transaction_id },
    });

    if (transaction.user_id != user_id)
      throw new BadRequestException(
        'Usuário não possui acesso para atualizar a transação.',
      );

    if (
      updateTransactionDto.account_id != undefined &&
      transaction.account_id != updateTransactionDto.account_id
    ) {
      const account = await this.prisma.account.findUnique({
        where: { id: updateTransactionDto.account_id },
        include: { account_member: true },
      });

      if (!account)
        throw new BadRequestException('Conta informada não existe.');

      const userHasAccountAcess = account.account_member.some(
        (member) => member.user_id == user_id,
      );

      if (!userHasAccountAcess) {
        throw new BadRequestException(
          'Usuário não possui acesso a conta informada.',
        );
      }
    }

    if (
      updateTransactionDto.category_id != undefined &&
      transaction.category_id != updateTransactionDto.category_id
    ) {
      const category = await this.prisma.category.findFirst({
        where: { id: updateTransactionDto.category_id },
      });

      if (!category)
        throw new BadRequestException('Categoria informada não existe.');

      if (category.user_id != user_id)
        throw new BadRequestException(
          'Usuário não possui acesso a categoria informada.',
        );

      if (category.type != CategoryType.Transaction)
        throw new BadRequestException('Categoria deve ser do tipo Transação.');
    }

    const data = updateTransactionDto;

    return this.prisma.transaction.update({
      where: { id: transaction_id },
      data,
    });
  }

  async remove(user_id: number, transaction_id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transaction_id },
    });

    if (transaction.user_id != user_id)
      throw new UnauthorizedException(
        'Usuário não possui permissão para excluir a transação.',
      );

    return this.prisma.transaction.delete({ where: { id: transaction_id } });
  }

  async exists(transaction_id: number): Promise<boolean> {
    return !!(await this.prisma.transaction.findUnique({
      where: { id: transaction_id },
    }));
  }
}
