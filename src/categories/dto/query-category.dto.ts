import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { capitalize } from 'src/utils/helpers/string-test.helper';
import { CategoryType } from '../enums/category-type.enum';

export class QueryCategoryDto {
  @IsOptional()
  name: string;

  @IsEnum(CategoryType, { message: 'Tipo inválido' })
  @Transform(({ value }) => capitalize(value))
  @IsOptional()
  type: CategoryType;
}
