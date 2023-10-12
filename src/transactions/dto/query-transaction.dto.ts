import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryTransactionDto {
  @IsString({ message: 'Descrição informada inválida.' })
  @IsOptional({ message: 'Descrição deve ser informada.' })
  description: string;

  @IsDate({ message: 'Data informada inválida.' })
  @IsOptional({ message: 'Data deve ser informada.' })
  date: Date;

  @IsNumber()
  @IsOptional()
  month: number;

  @IsNumber()
  @IsOptional()
  year: number;

  @IsNumber({ allowNaN: false }, { message: 'Conta informada inválida.' })
  @IsOptional()
  account_id: number;

  @IsNumber({ allowNaN: false }, { message: 'Categoria informada inválida.' })
  @IsOptional()
  category_id: number;
}
