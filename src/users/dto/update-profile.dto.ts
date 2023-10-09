import { UpdateProfile } from '../models/update-profile.model';
import { IsAlpha, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileDto implements UpdateProfile {
  @IsEmail({}, { message: 'E-mail deve ser válido.' })
  @IsNotEmpty({ message: 'E-mail deve ser informado.' })
  @IsOptional()
  email: string;

  @IsAlpha('pt-BR')
  @IsNotEmpty({ message: 'Nome deve ser informado.' })
  @IsOptional()
  name: string;
}
