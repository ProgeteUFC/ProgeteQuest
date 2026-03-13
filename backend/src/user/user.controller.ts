import { Body, Controller, Delete, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Get } from '@nestjs/common';
import { Param, Put } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UnauthorizedException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('teacher')
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Roles('teacher', 'student')
  @Put()
  async update(
    @Body() updateUserDto: Partial<CreateUserDto>,
    @User() user: UserPayload,
  ) {
    return this.userService.update(user.userId, updateUserDto);
  }

  @Roles('teacher', 'student')
  @Post('delete')
  async remove(@User() user: UserPayload, @Body() body: { password: string }) {
    return this.userService.remove(user.userId, body.password);
  }

  @Roles('teacher', 'student')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
