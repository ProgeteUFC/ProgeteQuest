import { CreateUserDto } from 'src/user/dtos/createUser.dto';

export class CreateStudentDto extends CreateUserDto {
  registrationStudent: string;
}
