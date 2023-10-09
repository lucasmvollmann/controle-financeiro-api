import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountMemberRole } from './enums/account-member-role.enum';
import { CategoryType } from 'src/categories/enums/category-type.enum';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createAccountDto: CreateAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: { name: createAccountDto.name },
      select: { accountMember: { where: { userId } } },
    });

    console.log(account);

    if (account?.accountMember.length > 0)
      throw new ConflictException('Nome informado já está em uso');

    const category = await this.prisma.category.findUnique({
      where: { id: createAccountDto.categoryId },
    });

    if (!category)
      throw new BadRequestException('Categoria informada não existe.');

    if (category.userId != userId)
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a categoria informada.',
      );

    if (category.type != CategoryType.Account)
      throw new BadRequestException(
        'Categoria informada deve ser do tipo Conta.',
      );

    const data = {
      ...createAccountDto,
      accountMember: { create: [{ userId, role: AccountMemberRole.Owner }] },
    };

    return this.prisma.account.create({ data });
  }

  findAll(userId: number) {
    return this.prisma.account.findMany({
      where: { accountMember: { every: { userId } } },
    });
  }

  async findOne(userId: number, accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        accountMember: true,
      },
    });

    if (
      !account.accountMember.filter(
        (accountMember) => accountMember.userId == userId,
      )
    )
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a conta.',
      );

    delete account.accountMember;
    return account;
  }

  async update(
    userId: number,
    accountId: number,
    updateAccountDto: UpdateAccountDto,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        accountMember: true,
      },
    });

    if (!this.userIsOwner(userId, account))
      throw new UnauthorizedException(
        'Usuário sem permissão para atualizar a conta.',
      );

    if (
      updateAccountDto.name != undefined &&
      account.name != updateAccountDto.name
    ) {
      const accountNameInUse = await this.accountNameInUse(
        updateAccountDto.name,
        userId,
      );

      if (accountNameInUse)
        throw new ConflictException('Nome informado já está em uso.');
    }

    if (
      updateAccountDto.categoryId != undefined &&
      account.categoryId != updateAccountDto.categoryId
    ) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateAccountDto.categoryId },
      });

      if (!category)
        throw new BadRequestException('Categoria informada não existe.');

      if (category.userId != userId)
        throw new UnauthorizedException(
          'Usuário sem permissão para acessar a categoria informada.',
        );

      if (category.type != CategoryType.Account)
        throw new BadRequestException(
          'Categoria informada deve ser do tipo Conta.',
        );
    }

    const data = updateAccountDto;

    const createdAccount = await this.prisma.account.update({
      where: { id: accountId },
      data,
    });

    return createdAccount;
  }

  async remove(userId: number, accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        accountMember: true,
      },
    });

    if (!this.userIsOwner(userId, account))
      throw new UnauthorizedException(
        'Usuário sem permissão para eliminar a conta.',
      );

    return this.prisma.account.delete({ where: { id: accountId } });
  }

  async getMembers(userId: number, accountId: number) {
    const accountMembers = await this.prisma.accountMember.findMany({
      where: { accountId },
    });

    if (!accountMembers.some((accountMember) => accountMember.userId == userId))
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a conta.',
      );

    return accountMembers;
  }

  async exists(accountId: number): Promise<boolean> {
    return !!(await this.prisma.account.findUnique({
      where: { id: accountId },
    }));
  }

  userIsOwner(userId: number, account: any): boolean {
    return account.accountMember.some(
      (member) =>
        member.userId == userId && member.role == AccountMemberRole.Owner,
    );
  }

  async accountNameInUse(name: string, userId: number) {
    const account = await this.prisma.account.findFirst({
      where: { name },
      select: { accountMember: { where: { userId } } },
    });

    return account ? account.accountMember.length > 0 : false;
  }
}
