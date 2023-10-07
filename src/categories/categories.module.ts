import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CapitalizeConstraint } from 'src/utils/decorators/capitalize.decorator';
import { StringHelper } from 'src/utils/helpers/string.helper';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    PrismaService,
    CategoriesService,
    CapitalizeConstraint,
    StringHelper,
  ],
})
export class CategoriesModule {}
