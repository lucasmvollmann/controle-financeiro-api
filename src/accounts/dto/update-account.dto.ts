import {
  IsAlpha,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAccountDto {
  @IsNotEmpty({ message: 'Nome deve ser informado.' })
  @IsAlpha('pt-BR')
  @IsString({ message: 'Nome inválido.' })
  @IsOptional()
  name: string;

  @IsNumber({ allowNaN: false }, { message: 'Categoria inválida' })
  @IsOptional()
  category_id: number;
}
