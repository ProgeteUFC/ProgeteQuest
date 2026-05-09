import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckinDto {
  @ApiProperty({ example: 'uuid-da-atividade', description: 'ID da atividade' })
  activityId: string;

  @ApiProperty({ example: 'uuid-do-estudante', description: 'ID do estudante' })
  studentId: string;

  @ApiProperty({ example: 'uuid-do-codigo', description: 'ID do código utilizado para check-in' })
  codeId: string;
}
