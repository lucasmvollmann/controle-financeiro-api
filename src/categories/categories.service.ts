import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryType } from './enums/category-type.enum';
//import { UserRole } from 'src/users/enums/user-role.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { StringHelper } from 'src/utils/helpers/string.helper';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stringHelper: StringHelper,
  ) {}

  async create(user_id: number, createCategoryDto: CreateCategoryDto) {
    const categoryExists = !!(await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
        OR: [
          {
            user: {
              role: UserRole.Admin,
            },
          },
          {
            user: {
              id: user_id,
            },
          },
        ],
      },
    }));

    if (categoryExists)
      throw new ConflictException('Nome informado já está em uso.');

    const data = { ...createCategoryDto, user_id };

    return this.prisma.category.create({ data });
  }

  findAll(user_id: number, query?: QueryCategoryDto) {
    const where = {
      where: {
        user_id: user_id,
        name: { contains: query?.name, mode: Prisma.QueryMode.insensitive },
        type: query?.type
          ? (this.stringHelper.capitalize(query?.type) as CategoryType)
          : undefined,
      },
    };

    return this.prisma.category.findMany(where);
  }

  async findOne(user_id: number, id: number) {
    const userHasPermission = await this.prisma.category.findUnique({
      where: { id, user_id },
    });

    if (!userHasPermission)
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a categoria informada.',
      );

    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(
    user_id: number,
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const userHasPermission = await this.prisma.category.findUnique({
      where: { id, user_id },
    });

    if (!userHasPermission)
      throw new UnauthorizedException(
        'Usuário sem permissão para atualizar a categoria informada.',
      );

    const category = await this.prisma.category.findUnique({ where: { id } });

    if (updateCategoryDto?.name && category.name != updateCategoryDto?.name) {
      const categoryExists = await this.prisma.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          type: category.type,
          OR: [
            {
              user: {
                role: UserRole.Admin,
              },
            },
            {
              user: {
                id: user_id,
              },
            },
          ],
        },
      });

      if (categoryExists)
        throw new ConflictException(
          'Já existe uma categoria com o nome informado.',
        );
    }

    if (updateCategoryDto?.type && category.type != updateCategoryDto?.type) {
      const categoryExists = await this.prisma.category.findFirst({
        where: {
          name: category.name,
          type: updateCategoryDto?.type,
          OR: [
            {
              user: {
                role: UserRole.Admin,
              },
            },
            {
              user: {
                id: user_id,
              },
            },
          ],
        },
      });

      if (categoryExists)
        throw new ConflictException(
          'Já existe uma categoria com o tipo informado.',
        );
    }

    const data = { ...updateCategoryDto, user_id };

    const createdCategory = await this.prisma.category.update({
      where: { id },
      data,
    });

    return createdCategory;
  }

  async remove(user_id: number, id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transaction: true, account: true },
        },
      },
    });

    if (category.user_id != user_id)
      throw new UnauthorizedException(
        'Usuário não tem permissão para excluir a categoria.',
      );

    if (category._count[category.type.toLowerCase()] > 0)
      throw new BadRequestException(
        'Não é possível eliminar a categoria, pois ela está em uso.',
      );

    return this.prisma.category.delete({ where: { id } });
  }

  async exists(id: number, user_id?: number) {
    return this.prisma.category.findUnique({ where: { id, user_id } });
  }
}
