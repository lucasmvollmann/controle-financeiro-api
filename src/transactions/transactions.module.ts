import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DateHelper } from 'src/utils/helpers/date.helper';

@Module({
  controllers: [TransactionsController],
  providers: [PrismaService, TransactionsService, DateHelper],
})
export class TransactionsModule {}
