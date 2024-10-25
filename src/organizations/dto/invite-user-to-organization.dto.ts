import { IsEmail } from 'class-validator';

export class InviteUserToOrganizationDto {
  @IsEmail()
  email: string;
}
