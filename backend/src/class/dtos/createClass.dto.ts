import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Turma 1', description: 'Nome da turma' })
  name: string;

  @ApiProperty({ example: 'uuid-da-turma', description: 'ID da turma' })
  classId: string;

  @ApiProperty({ example: 'uuid-do-professor', description: 'ID do professor responsável' })
  teacherId: string;
}
