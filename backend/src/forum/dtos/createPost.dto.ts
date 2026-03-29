import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsUUID()
  topicId: string;

  @IsNotEmpty()
  @IsUUID()
  autorId: string;

  @IsNotEmpty()
  @IsString()
  mensagem: string;
}
