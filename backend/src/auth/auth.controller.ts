import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { RegisterStudentDto } from './dtos/registerStudent.dto';
import { UserService } from 'src/user/user.service';
import { UserType } from 'src/Enums/user.enum';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register/student')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Cadastrar-se como aluno',
    description:
      'Cadastro público, aberto a qualquer pessoa. Cria sempre uma conta de aluno: o tipo é definido pelo servidor e não pode ser escolhido na requisição. Para criar professores, use Administração → POST /admin/users.',
  })
  @ApiBody({ type: RegisterStudentDto })
  @ApiResponse({ status: 201, description: 'Aluno cadastrado com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos. Enviar o campo type nesta rota também resulta em 400.',
  })
  @ApiResponse({ status: 409, description: 'E-mail ou matrícula já em uso.' })
  async registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
    // O tipo é fixado aqui, no servidor: nada do corpo da requisição
    // influencia o perfil criado.
    return this.userService.create({
      ...registerStudentDto,
      type: UserType.STUDENT,
    });
  }

  @Post('login')
  @ApiOperation({
    summary: 'Entrar no sistema',
    description:
      'Valida e-mail e senha e retorna um token JWT, além dos dados básicos e do perfil do usuário. Use o token no botão Authorize para testar as demais rotas.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login realizado com sucesso.',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          userId: '550e8400-e29b-41d4-a716-446655440000',
          email: 'maria@exemplo.com',
          name: 'Maria Silva',
          type: 'student',
          isAdmin: false,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Muitas tentativas de login.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos.' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
