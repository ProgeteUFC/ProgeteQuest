import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login', description: 'Realiza o login do usuário e retorna o token JWT.' })
  @ApiBody({ description: 'Credenciais de login', examples: { exemplo: { value: { email: 'maria@exemplo.com', password: 'senha123' } } } })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso. Retorna o token JWT.' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
