import { CategoryType } from '../enums/category-type.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty({ message: 'Nome deve ser informado.' })
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(CategoryType, { message: 'Tipo inválido.' })
  @IsOptional()
  type: CategoryType;
}
