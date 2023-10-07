import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { CategoriesService } from '../categories.service';

export class CategoryId implements PipeTransform {
  @Inject(CategoriesService)
  private readonly categoriesService: CategoriesService;

  async transform(value: any, metadata: ArgumentMetadata): Promise<number> {
    if (isNaN(value)) {
      throw new BadRequestException('Parâmetro ID inválido.');
    }

    const categoryExists = await this.categoriesService.exists(+value);
    if (!categoryExists) {
      throw new NotFoundException('Categoria informada não existe.');
    }

    return value;
  }
}
