import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountMemberRole } from './enums/account-member-role.enum';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createAccountDto: CreateAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: { name: createAccountDto.name },
      include: { accountMember: { where: { userId } } },
    });

    if (account.accountMember.length > 0)
      throw new ConflictException('Nome informado já está em uso');

    const data = {
      ...createAccountDto,
      AccountMember: { create: [{ userId, role: AccountMemberRole.Owner }] },
    };

    console.log(createAccountDto, data);

    return this.prisma.account.create({ data });
  }

  findAll(userId: number) {
    return `This action returns all accounts`;
  }

  findOne(userId: number, accountId: number) {
    return `This action returns a #${accountId} account`;
  }

  update(
    userId: number,
    accountId: number,
    updateAccountDto: UpdateAccountDto,
  ) {
    return `This action updates a #${accountId} account`;
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
        'Uusário sem permissão para acessar a conta.',
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
}
