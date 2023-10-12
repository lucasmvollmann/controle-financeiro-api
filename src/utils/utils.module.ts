import { Module } from '@nestjs/common';
import { PasswordHelper } from './helpers/password.helper';
import { StringHelper } from './helpers/string.helper';
import { DateHelper } from './helpers/date.helper';

@Module({
  providers: [PasswordHelper, StringHelper, DateHelper],
  exports: [PasswordHelper, StringHelper, DateHelper],
})
export class UtilsModule {}
