import { Exclude } from 'class-transformer';

export class UserInfoDto {
  userId!: string;
  name!: string;
  email!: string;
}
