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

  async create(user_id: number, createAccountDto: CreateAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: { name: createAccountDto.name },
      select: { account_member: { where: { user_id } } },
    });

    console.log(account);

    if (account?.account_member.length > 0)
      throw new ConflictException('Nome informado já está em uso');

    const category = await this.prisma.category.findUnique({
      where: { id: createAccountDto.category_id },
    });

    if (!category)
      throw new BadRequestException('Categoria informada não existe.');

    if (category.user_id != user_id)
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a categoria informada.',
      );

    if (category.type != CategoryType.Account)
      throw new BadRequestException(
        'Categoria informada deve ser do tipo Conta.',
      );

    const data = {
      ...createAccountDto,
      account_member: { create: [{ user_id, role: AccountMemberRole.Owner }] },
    };

    return this.prisma.account.create({ data });
  }

  findAll(user_id: number) {
    return this.prisma.account.findMany({
      where: { account_member: { every: { user_id } } },
    });
  }

  async findOne(user_id: number, account_id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: account_id },
      include: {
        account_member: true,
      },
    });

    if (
      !account.account_member.filter(
        (account_member) => account_member.user_id == user_id,
      )
    )
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a conta.',
      );

    delete account.account_member;
    return account;
  }

  async update(
    user_id: number,
    account_id: number,
    updateAccountDto: UpdateAccountDto,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: account_id },
      include: {
        account_member: true,
      },
    });

    if (!this.userIsOwner(user_id, account))
      throw new UnauthorizedException(
        'Usuário sem permissão para atualizar a conta.',
      );

    if (
      updateAccountDto.name != undefined &&
      account.name != updateAccountDto.name
    ) {
      const accountNameInUse = await this.accountNameInUse(
        updateAccountDto.name,
        user_id,
      );

      if (accountNameInUse)
        throw new ConflictException('Nome informado já está em uso.');
    }

    if (
      updateAccountDto.category_id != undefined &&
      account.category_id != updateAccountDto.category_id
    ) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateAccountDto.category_id },
      });

      if (!category)
        throw new BadRequestException('Categoria informada não existe.');

      if (category.user_id != user_id)
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
      where: { id: account_id },
      data,
    });

    return createdAccount;
  }

  async remove(user_id: number, account_id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: account_id },
      include: {
        account_member: true,
      },
    });

    if (!this.userIsOwner(user_id, account))
      throw new UnauthorizedException(
        'Usuário sem permissão para eliminar a conta.',
      );

    return this.prisma.account.delete({ where: { id: account_id } });
  }

  async getMembers(user_id: number, account_id: number) {
    const account_members = await this.prisma.account_member.findMany({
      where: { account_id },
    });

    if (
      !account_members.some(
        (account_member) => account_member.user_id == user_id,
      )
    )
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a conta.',
      );

    return account_members;
  }

  async exists(account_id: number): Promise<boolean> {
    return !!(await this.prisma.account.findUnique({
      where: { id: account_id },
    }));
  }

  userIsOwner(user_id: number, account: any): boolean {
    return account.account_member.some(
      (member) =>
        member.user_id == user_id && member.role == AccountMemberRole.Owner,
    );
  }

  async accountNameInUse(name: string, user_id: number) {
    const account = await this.prisma.account.findFirst({
      where: { name },
      select: { account_member: { where: { user_id } } },
    });

    return account ? account.account_member.length > 0 : false;
  }
}
