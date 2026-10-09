import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { generateUuid } from '../utils/generateUuid';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserStatus, UserType } from 'src/Enums/user.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verifica o tipo de usuário
    if (
      createUserDto.type !== 'student' &&
      createUserDto.type !== 'teacher' &&
      createUserDto.type !== 'admin'
    ) {
      throw new BadRequestException('Tipo de usuário inválido');
    }

    // Verifica se o email já está em uso
    const email = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Esse registro já existe');
    }

    // Validação antecipada da matrícula com verificação cruzada
    if (createUserDto.type === 'student') {
      const reg = createUserDto.registrationStudent?.trim();

      if (!reg) {
        throw new BadRequestException('registrationStudent é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationStudent deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      if (existingStudent || existingTeacher) {
        throw new ConflictException('Esse registro já existe');
      }
    } else if (createUserDto.type === 'teacher') {
      const reg = createUserDto.registrationTeacher?.trim();

      if (!reg) {
        throw new BadRequestException('registrationTeacher é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationTeacher deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      if (existingTeacher || existingStudent) {
        throw new ConflictException('Esse registro já existe');
      }
    }

    // Criação e salvamento do usuário
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // O usuário e o seu perfil nascem juntos: se o perfil falhar, o usuário
    // não fica gravado pela metade (sem perfil ele nem conseguiria logar).
    const user = await this.dataSource.transaction(async (manager) => {
      const registration =
        createUserDto.type === 'student'
          ? createUserDto.registrationStudent
          : createUserDto.type === 'teacher'
            ? createUserDto.registrationTeacher
            : undefined;
      if (registration)
        await this.assertRegistrationAvailable(
          manager,
          '',
          registration.trim(),
        );
      const novoUsuario = manager.create(User, {
        userId: generateUuid(),
        name: createUserDto.name.trim(),
        email,
        password: hashedPassword,
        type: createUserDto.type,
      });

      await manager.save(novoUsuario);

      // Criação do vínculo com estudante, professor ou admin
      if (createUserDto.type === 'student') {
        await manager.save(Student, {
          userId: novoUsuario.userId,
          registrationStudent: createUserDto.registrationStudent?.trim(),
          user: novoUsuario,
        });
      } else if (createUserDto.type === 'teacher') {
        await manager.save(Teacher, {
          userId: novoUsuario.userId,
          registrationTeacher: createUserDto.registrationTeacher?.trim(),
          user: novoUsuario,
        });
      } else if (createUserDto.type === 'admin') {
        await manager.save(Admin, {
          userId: novoUsuario.userId,
          user: novoUsuario,
        });
      }

      return novoUsuario;
    });

    // Retorno dos dados públicos
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: [
        'userId',
        'name',
        'email',
        'type',
        'status',
        'createdAt',
        'updatedAt',
      ],
      relations: ['students', 'teachers', 'admins'],
    });

    return users.map((user) => ({
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      type: user.type,
      status: user.status,
      registrationStudent: user.students?.[0]?.registrationStudent,
      registrationTeacher: user.teachers?.[0]?.registrationTeacher,
    }));
  }

  async remove(userId: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Valida senha
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    // Remove registros de administrador, se existirem
    if (user.admins && user.admins.length > 0) {
      await this.adminRepository.delete({ userId });
    }

    // Remove registros de estudante, se existirem
    if (user.students && user.students.length > 0) {
      await this.studentRepository.delete({ userId });
    }

    // Remove registros de professor, se existirem
    if (user.teachers && user.teachers.length > 0) {
      await this.teacherRepository.delete({ userId });
    }

    // Remove o usuário
    await this.userRepository.delete({ userId });

    return { message: 'Usuário removido com sucesso' };
  }

  async update(userId: string, body: UpdateUserDto) {
    const fields = [
      'name',
      'email',
      'password',
      'registrationStudent',
      'registrationTeacher',
    ];
    if (Object.keys(body).some((key) => !fields.includes(key))) {
      throw new BadRequestException(
        'Não é permitido alterar o perfil ou enviar campos desconhecidos',
      );
    }
    const entries = Object.entries(body).filter(
      ([, value]) => value !== undefined,
    );
    if (
      !entries.length ||
      entries.some(([, value]) => typeof value !== 'string' || !value.trim())
    ) {
      throw new BadRequestException('Informe campos válidos e não vazios');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        // A mesma matrícula é reservada em criação e edição, inclusive entre perfis.
        const registration =
          body.registrationStudent ?? body.registrationTeacher;
        if (registration !== undefined) {
          if (!/^\d{6}$/.test(registration.trim())) {
            throw new BadRequestException(
              'Matrícula/SIAPE deve conter exatamente 6 dígitos',
            );
          }
          await this.assertRegistrationAvailable(
            manager,
            userId,
            registration.trim(),
          );
        }
        const user = await manager.findOne(User, {
          where: { userId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!user) throw new BadRequestException('Usuário não encontrado');
        if (
          body.registrationStudent !== undefined &&
          user.type !== UserType.STUDENT
        ) {
          throw new BadRequestException(
            'Matrícula de aluno não se aplica a este perfil',
          );
        }
        if (
          body.registrationTeacher !== undefined &&
          user.type !== UserType.TEACHER
        ) {
          throw new BadRequestException('SIAPE não se aplica a este perfil');
        }
        if (body.email !== undefined) {
          const email = body.email.trim().toLowerCase();
          const existing = await manager.findOne(User, { where: { email } });
          if (existing && existing.userId !== userId) {
            throw new ConflictException('E-mail já cadastrado');
          }
          user.email = email;
        }
        if (body.name !== undefined) user.name = body.name.trim();
        if (body.password !== undefined)
          user.password = await bcrypt.hash(body.password, 10);

        if (body.registrationStudent !== undefined) {
          const profile = await manager.findOne(Student, { where: { userId } });
          if (!profile)
            throw new BadRequestException('Perfil de aluno não encontrado');
          profile.registrationStudent = body.registrationStudent.trim();
          await manager.save(Student, profile);
        }
        if (body.registrationTeacher !== undefined) {
          const profile = await manager.findOne(Teacher, { where: { userId } });
          if (!profile)
            throw new BadRequestException('Perfil de professor não encontrado');
          profile.registrationTeacher = body.registrationTeacher.trim();
          await manager.save(Teacher, profile);
        }
        await manager.save(User, user);
        return {
          userId: user.userId,
          name: user.name,
          email: user.email,
          type: user.type,
          status: user.status,
        };
      });
    } catch (error) {
      if (
        (error as { driverError?: { code?: string } }).driverError?.code ===
        '23505'
      ) {
        throw new ConflictException('E-mail ou matrícula/SIAPE já cadastrado');
      }
      throw error;
    }
  }

  private async assertRegistrationAvailable(
    manager: EntityManager,
    userId: string,
    registration: string,
  ) {
    await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      `registration:${registration}`,
    ]);
    const student = await manager.findOne(Student, {
      where: { registrationStudent: registration },
    });
    const teacher = await manager.findOne(Teacher, {
      where: { registrationTeacher: registration },
    });
    if (
      (student && student.userId !== userId) ||
      (teacher && teacher.userId !== userId)
    ) {
      throw new ConflictException('Matrícula/SIAPE já cadastrado');
    }
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      type: user.type,
      status: user.status,
      registrationStudent: user.students?.[0]?.registrationStudent,
      registrationTeacher: user.teachers?.[0]?.registrationTeacher,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deactivate(userId: string, adminId: string, reason: string) {
    if (userId === adminId) {
      throw new BadRequestException('Você não pode desativar a própria conta');
    }

    return this.dataSource.transaction(async (manager) => {
      const activeAdmins = await manager
        .createQueryBuilder(User, 'user')
        .setLock('pessimistic_write')
        .where('user.type = :type', { type: UserType.ADMIN })
        .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
        .orderBy('user.user_id', 'ASC')
        .getMany();

      const user = await manager.findOne(User, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      if (user.status === UserStatus.INACTIVE) {
        return {
          userId: user.userId,
          status: user.status,
          message: 'Usuário já estava inativo',
        };
      }

      if (user.type === UserType.ADMIN && activeAdmins.length <= 1) {
        throw new BadRequestException(
          'Não é possível desativar o último administrador ativo',
        );
      }

      user.status = UserStatus.INACTIVE;
      user.deactivatedAt = new Date();
      user.deactivatedBy = adminId;
      user.deactivationReason = reason;

      await manager.save(user);

      return {
        userId: user.userId,
        status: user.status,
        deactivatedAt: user.deactivatedAt,
        deactivatedBy: user.deactivatedBy,
        deactivationReason: user.deactivationReason,
      };
    });
  }

  async activate(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Idempotente: se já está ativo, não faz nada e retorna sucesso
    if (user.status === UserStatus.ACTIVE) {
      return {
        userId: user.userId,
        status: user.status,
        message: 'Usuário já estava ativo',
      };
    }

    user.status = UserStatus.ACTIVE;
    user.deactivatedAt = null;
    user.deactivatedBy = null;
    user.deactivationReason = null;

    await this.userRepository.save(user);

    return { userId: user.userId, status: user.status };
  }
}
