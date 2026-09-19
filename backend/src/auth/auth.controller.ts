import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
