import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountMemberRole } from './enums/account-member-role.enum';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createAccountDto: CreateAccountDto) {
    /*
    const accountExists = await this.prisma.accountMember.findFirst({
      //where: { userId },
      select: { account: { where: { name: createAccountDto.name } } },
    });
    */

    const accountExists = await this.prisma.account.findFirst({
      where: { name: createAccountDto.name },
      select: { AccountMember: { where: { userId } } },
    });

    //console.log(accountExists);

    if (accountExists.AccountMember.length > 0)
      throw new ConflictException('Nome informado já está em uso');

    const data = {
      ...createAccountDto,
      AccountMember: { create: [{ userId, role: AccountMemberRole.Owner }] },
    };

    console.log(createAccountDto, data);

    return this.prisma.account.create({ data });
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async getMembers(userId: number, id: number) {
    const accountMember = await this.prisma.
    throw new Error('Method not implemented.');
  }
}
