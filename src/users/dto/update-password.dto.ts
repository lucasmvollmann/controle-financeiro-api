import { Match } from 'src/utils/decorators/match.decorator';

import {
  IsDefined,
  IsNotEmpty,
  IsStrongPassword,
  IsStrongPasswordOptions,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Senha deve ser informada.' })
  @IsDefined({ message: 'Senha deve ser informada.' })
  old_password: string;

  @IsStrongPassword(getPasswordOptions(), {
    message:
      'Sua senha deve conter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas, números e caracteres especiais.',
  })
  @IsNotEmpty({ message: 'Nova senha deve ser informada.' })
  @IsDefined({ message: 'Nova senha deve ser informada.' })
  new_password: string;

  @Match('newPassword', { message: 'Confirmação de senha inválida.' })
  @IsNotEmpty({ message: 'Confirmação de senha deve ser informada.' })
  @IsDefined({ message: 'Confirmação de senha deve ser informada.' })
  new_password_confirm: string;
}

function getPasswordOptions(): IsStrongPasswordOptions {
  return { minLength: 8 };
}
