import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateProfile } from './models/update-profile.model';

import { PasswordHelper } from 'src/utils/helpers/password.helper';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailAlreadyUsed = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (emailAlreadyUsed) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const password = await this.passwordHelper.hash(createUserDto.password);

    const data = {
      ...createUserDto,
      password: password,
      passwordConfirm: undefined,
    };

    const createdUser = await this.prisma.user.create({
      data,
      select: { email: true, name: true },
    });

    return createdUser;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    // TODO: Criar validação para verificar se o usuário tem permissão para realizar a alteração
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    /* TODO:
     * Criar validação para verificar se o usuário tem permissão
     * para realizar a alteração de senha
     */

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const isPasswordMatch = await this.passwordHelper.verify(
      user.password,
      updatePasswordDto.oldPassword,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Senha atual está incorreta.');
    }

    const newPassword = await this.passwordHelper.hash(
      updatePasswordDto.newPassword,
    );

    const savedPassword = !!(await this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    }));

    if (savedPassword) {
      return 'Senha alterada com sucesso.';
    } else {
      throw new InternalServerErrorException();
    }
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    /* TODO:
     * Criar validação para verificar se o usuário tem permissão
     * para realizar a alteração de perfil
     */

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    let data: UpdateProfile = {};

    if (updateProfileDto?.email != undefined) {
      if (user.email != updateProfileDto.email) {
        const emailAlreadyUsed = await this.emailAlreadyUsed(
          updateProfileDto.email,
        );

        if (emailAlreadyUsed) {
          throw new ConflictException('E-mail já cadastrado');
        }

        data.email = updateProfileDto.email; //{ email: updateProfileDto.email };
      }
    }

    if (updateProfileDto?.name != undefined) {
      if (user.name != updateProfileDto.name) {
        data.name = updateProfileDto.name;
      }
    }

    if (!Object.values(data).length) {
      return 'Nenhuma informação foi atualizada.';
    }

    const updateCompleted = !!(await this.prisma.user.update({
      where: { id },
      data,
    }));

    if (updateCompleted) {
      return 'Atualização realizada com sucesso.';
    } else {
      throw new InternalServerErrorException();
    }
  }

  async exists(id: number): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({ where: { id } }));
  }

  async emailAlreadyUsed(email: string): Promise<boolean> {
    return !!(await this.prisma.user.findFirst({ where: { email } }));
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
}
