import { UserRole } from '../enums/user-role.enum';

export class User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
