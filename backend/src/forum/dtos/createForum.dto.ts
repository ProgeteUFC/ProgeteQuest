import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateForumDto {
  @IsNotEmpty()
  @IsUUID()
  turmaId: string;
}
