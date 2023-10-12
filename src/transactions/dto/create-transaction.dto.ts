import {
  IsDate,
  IsDecimal,
  IsDefined,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString({ message: 'Descrição informada inválida.' })
  @IsDefined({ message: 'Descrição deve ser informada.' })
  description: string;

  @IsDecimal({}, { message: 'Valor informado inválido.' })
  @IsDefined({ message: 'Valor deve ser informado.' })
  value: string;

  @IsDate({ message: 'Data informada inválida.' })
  @IsDefined({ message: 'Data deve ser informada.' })
  date: Date;

  @IsNumber({ allowNaN: false }, { message: 'Conta inválida.' })
  @IsDefined({ message: 'Conta deve ser informada.' })
  account_id: number;

  @IsNumber({ allowNaN: false }, { message: 'Categoria inválida.' })
  @IsDefined({ message: 'Categoria deve ser informada.' })
  category_id: number;
}
