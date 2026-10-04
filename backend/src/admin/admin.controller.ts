import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';
import { CreateUserByAdminDto } from './dtos/createUserByAdmin.dto';

@ApiTags('Administração')
@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiForbiddenResponse({
    description: 'Token ausente, inválido ou sem perfil de administrador.',
  })
  @Post('users')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Cadastrar aluno ou professor',
    description:
      'Exclusivo de administradores. Cria uma conta de aluno ou de professor. Não é possível criar administradores por esta rota.',
  })
  @ApiBody({
    type: CreateUserByAdminDto,
    examples: {
      professor: {
        summary: 'Criar professor',
        value: {
          name: 'Carlos Souza',
          email: 'carlos@exemplo.com',
          password: 'senha123',
          type: 'teacher',
          registrationTeacher: '654321',
        },
      },
      estudante: {
        summary: 'Criar aluno',
        value: {
          name: 'Maria Silva',
          email: 'maria@exemplo.com',
          password: 'senha123',
          type: 'student',
          registrationStudent: '123456',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou tipo diferente de student/teacher.',
  })
  @ApiResponse({ status: 409, description: 'E-mail ou matrícula já em uso.' })
  async createUser(@Body() createUserByAdminDto: CreateUserByAdminDto) {
    return this.userService.create(createUserByAdminDto);
  }
}
