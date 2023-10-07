import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/enums/user-role.enum';

export const Role = (roles: UserRole) => SetMetadata('roles', roles);
