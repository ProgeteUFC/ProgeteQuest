import { validate } from 'class-validator';
import { CreateManagedUserDto } from './dtos/create-managed-user.dto';
import { UserType } from '../Enums/user.enum';

describe('Administrative account creation', () => {
  const account = (type: UserType) => Object.assign(new CreateManagedUserDto(), {
    name: 'Administrador Teste', email: 'admin@exemplo.com', password: 'senha12345', type,
  });

  it('accepts an administrator without matrícula or SIAPE', async () => {
    await expect(validate(account(UserType.ADMIN))).resolves.toHaveLength(0);
  });

  it.each([UserType.STUDENT, UserType.TEACHER])('still requires identification for %s', async (type) => {
    const errors = await validate(account(type));
    expect(errors.some((error) => error.property === (type === UserType.STUDENT ? 'registrationStudent' : 'registrationTeacher'))).toBe(true);
  });
});
