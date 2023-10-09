import {
  IsAlpha,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Nome deve ser informado.' })
  @IsAlpha('pt-BR')
  @IsString({ message: 'Nome inválido.' })
  @IsDefined({ message: 'Nome deve ser informado.' })
  name: string;

  @IsNumber({ allowNaN: false }, { message: 'Categoria inválida' })
  @IsDefined({ message: 'Categoria deve ser informada.' })
  categoryId: number;
}
