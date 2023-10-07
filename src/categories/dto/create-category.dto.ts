import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryType } from '../enums/category-type.enum';

export class CreateCategoryDto {
  @IsDefined({ message: 'Nome deve ser informado.' })
  @IsNotEmpty({ message: 'Nome deve ser informado.' })
  @IsString()
  name: string;

  @IsDefined({ message: 'Tipo deve ser informado.' })
  @IsEnum(CategoryType, { message: 'Tipo inválido.' })
  type: CategoryType;
}
