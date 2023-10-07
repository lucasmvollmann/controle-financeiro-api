import { Match } from 'src/utils/decorators/match.decorator';

import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsStrongPasswordOptions,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail deve ser válido.' })
  @IsNotEmpty({ message: 'E-mail deve ser informado.' })
  @IsDefined({ message: 'E-mail deve ser informado.' })
  email: string;

  @IsDefined({ message: 'Senha deve ser informada.' })
  @IsStrongPassword(getPasswordOptions(), {
    message:
      'Sua senha deve conter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e caracteres especiais.',
  })
  password: string;

  @IsDefined({ message: 'Confirmação de senha deve ser informada.' })
  @Match('password', { message: 'Confirmação de senha inválida.' })
  passwordConfirm: string;

  @IsDefined({ message: 'Nome deve ser informado.' })
  @IsNotEmpty({ message: 'Nome deve ser informado.' })
  @IsString()
  name: string;
}

function getPasswordOptions(): IsStrongPasswordOptions {
  return { minLength: 8 };
}
