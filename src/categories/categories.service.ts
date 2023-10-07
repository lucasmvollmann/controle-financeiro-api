import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryType, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StringHelper } from 'src/utils/helpers/string.helper';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stringHelper: StringHelper,
  ) {}

  async create(userId: number, createCategoryDto: CreateCategoryDto) {
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
              id: userId,
            },
          },
        ],
      },
    }));

    if (categoryExists)
      throw new ConflictException('Nome informado já está em uso.');

    const data = { ...createCategoryDto, userId };

    return this.prisma.category.create({ data });
  }

  findAll(userId: number, query?: QueryCategoryDto) {
    const where = {
      where: {
        userId: userId,
        name: { contains: query?.name, mode: Prisma.QueryMode.insensitive },
        type: query?.type
          ? (this.stringHelper.capitalize(query?.type) as CategoryType)
          : undefined,
      },
    };

    return this.prisma.category.findMany(where);
  }

  async findOne(userId: number, id: number) {
    const userHasPermission = await this.prisma.category.findUnique({
      where: { id, userId },
    });

    if (!userHasPermission)
      throw new UnauthorizedException(
        'Usuário sem permissão para acessar a categoria informada.',
      );

    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(
    userId: number,
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const userHasPermission = await this.prisma.category.findUnique({
      where: { id, userId },
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
                id: userId,
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
                id: userId,
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

    const data = { ...updateCategoryDto, userId };

    const createdCategory = await this.prisma.category.update({
      where: { id },
      data,
    });

    return createdCategory;
  }

  async remove(userId: number, id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transaction: true, account: true },
        },
      },
    });

    if (category.userId != userId)
      throw new UnauthorizedException(
        'Usuário não tem permissão para excluir a categoria.',
      );

    if (category._count[category.type.toLowerCase()] > 0)
      throw new BadRequestException(
        'Não é possível eliminar a categoria, pois ela está em uso.',
      );

    return this.prisma.category.delete({ where: { id } });
  }

  async exists(id: number, userId?: number) {
    return this.prisma.category.findUnique({ where: { id, userId } });
  }
}
