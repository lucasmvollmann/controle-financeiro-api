import {
  IsDate,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsString({ message: 'Descrição informada inválida.' })
  @IsOptional()
  description: string;

  @IsDecimal({}, { message: 'Valor informado inválido.' })
  @IsOptional()
  value: string;

  @IsDate({ message: 'Data informada inválida.' })
  @IsOptional()
  date: Date;

  @IsNumber({ allowNaN: false }, { message: 'Conta inválida.' })
  @IsOptional()
  account_id: number;

  @IsNumber({ allowNaN: false }, { message: 'Categoria inválida.' })
  @IsOptional()
  category_id: number;
}
