import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthRequest } from '../models/auth-request.model';

export const GetUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<User> => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
