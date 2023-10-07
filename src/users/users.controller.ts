import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UserId } from './pipes/user-id.pipe';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from './enums/user-role.enum';
import { Role } from 'src/auth/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role(UserRole.Admin)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@GetUser() user, @Param('id') id: number) {
    return this.usersService.findOne(user.id);
  }

  @Patch(':id/profile')
  updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Patch(':id/password')
  updatePassword(
    @Param('id', UserId) id: number,
    @GetUser() user,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Role(UserRole.User)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
