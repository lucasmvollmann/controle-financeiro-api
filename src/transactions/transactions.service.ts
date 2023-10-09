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

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: createTransactionDto.accountId },
      include: { accountMember: true },
    });

    if (!account) throw new BadRequestException('Conta informada não existe.');

    const userHasAccountAcess = account.accountMember.some(
      (member) => member.userId == userId,
    );

    if (!userHasAccountAcess) {
      throw new BadRequestException(
        'Usuário não possui acesso a conta informada.',
      );
    }

    const category = await this.prisma.category.findFirst({
      where: { id: createTransactionDto.categoryId },
    });

    if (!category)
      throw new BadRequestException('Categoria informada não existe.');

    if (category.userId != userId)
      throw new BadRequestException(
        'Usuário não possui acesso a categoria informada.',
      );

    if (category.type != CategoryType.Transaction)
      throw new BadRequestException('Categoria deve ser do tipo Transação.');

    const data = { ...createTransactionDto, userId };

    return this.prisma.transaction.create({ data });
  }

  findAll(userId: number, query: QueryTransactionDto) {
    let year: number;
    let startDate: Date;
    let endDate: Date;

    if (query.month) {
      year = query.year ? query.year : new Date().getFullYear();
      startDate = getFirstDayOfMonth(query.month, year);
      endDate = getLastDayOfMonth(query.month, year);
    }

    const where = {
      where: {
        accountId: query.accountId,
        categoryId: query.categoryId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        userId: userId,
      },
    };

    console.log(where);

    return this.prisma.transaction.findMany(where);
  }

  async findOne(userId: number, transactionId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { accountMember: true },
    });

    if (transaction.accountMember.userId != userId)
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar transação.',
      );

    delete transaction.accountMember;

    return transaction;
  }

  update(
    userId: number,
    transactionId: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return `This action updates a #${transactionId} transaction`;
  }

  remove(userId: number, transactionId: number) {
    return `This action removes a #${transactionId} transaction`;
  }

  async exists(transactionId: number): Promise<boolean> {
    return !!(await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    }));
  }
}

function getLastDayOfMonth(month: number, year: number) {
  return new Date(year, month, 0);
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1);
}
