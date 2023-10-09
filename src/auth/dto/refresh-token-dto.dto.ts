import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh Token deve ser informado.' })
  @IsString()
  @IsDefined({ message: 'Refresh Token deve ser informado.' })
  refresh_token: string;
}
