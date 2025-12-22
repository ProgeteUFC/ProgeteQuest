import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RemoveStudentDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsOptional()
  @IsString()
  registrationStudent?: string;

  @IsOptional()
  @IsString()
  studentId?: string;
}
