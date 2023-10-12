import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountId } from './pipes/account-id.pipe';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@GetUser() user: User, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(user.id, createAccountDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.accountsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id', AccountId) account_id: number) {
    return this.accountsService.findOne(user.id, account_id);
  }

  @Get(':id/members')
  getMembers(
    @GetUser() user: User,
    @Param('id', AccountId) account_id: number,
  ) {
    return this.accountsService.getMembers(user.id, account_id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', AccountId) account_id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(user.id, account_id, updateAccountDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', AccountId) account_id: number) {
    return this.accountsService.remove(user.id, account_id);
  }
}
