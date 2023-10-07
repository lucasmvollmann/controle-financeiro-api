import { Module } from '@nestjs/common';
import { PasswordHelper } from './helpers/password.helper';
import { StringHelper } from './helpers/string.helper';

@Module({
  providers: [PasswordHelper, StringHelper],
  exports: [PasswordHelper, StringHelper],
})
export class UtilsModule {}
