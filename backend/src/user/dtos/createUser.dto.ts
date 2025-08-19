export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  type: 'student' | 'teacher';
  registrationStudent?: string;
  registrationTeacher?: string;
}
