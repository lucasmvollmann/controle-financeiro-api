import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { TransactionId } from './pipes/transaction-id.pipe';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user.id, createTransactionDto);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() query: QueryTransactionDto) {
    return this.transactionsService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id', TransactionId) id: number) {
    return this.transactionsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', TransactionId) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', TransactionId) id: number) {
    return this.transactionsService.remove(user.id, id);
  }
}
