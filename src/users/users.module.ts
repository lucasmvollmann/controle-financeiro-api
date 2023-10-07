import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordHelper } from 'src/utils/helpers/password.helper';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService, PasswordHelper],
  exports: [UsersService],
})
export class UsersModule {}
