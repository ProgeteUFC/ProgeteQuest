import { ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateAssessmentDto } from '../assessment/dtos/createAssessment.dto';
import { UpdateAssessmentDto } from '../assessment/dtos/updateAssessment.dto';
import { CreateActivityDto } from '../activity/dtos/createActivity.dto';
import { UpdateActivityDto } from '../activity/dtos/updateActivity.dto';
import { CreateCodeDto } from '../code/dtos/createCode.dto';
import { UpdateClassDto } from '../class/dtos/updateClass.dto';
import { EnrollStudentDto } from '../student_class/dtos/enrollStudent.dto';
import { RemoveStudentDto } from '../student_class/dtos/removeStudent.dto';

const uuid = '550e8400-e29b-41d4-a716-446655440000';

// Mesmas opções do ValidationPipe global (main.ts): sem forbidUnknownValues,
// um DTO sem decorator nenhum devolve [] — era assim que esses corpos passavam.
const validateDto = (cls: any, payload: Record<string, unknown>): string[] =>
  validateSync(plainToInstance(cls, payload) as object, {
    forbidUnknownValues: false,
  }).map((e) => e.property);

describe('Validação de entrada dos DTOs', () => {
  it('rejeita campo ausente, texto vazio e ID que não é UUID', () => {
    expect(validateDto(CreateAssessmentDto, { classId: 'nao-e-uuid' })).toEqual(
      expect.arrayContaining(['name', 'classId']),
    );
    expect(
      validateDto(CreateActivityDto, {
        name: '   ',
        date: 'ontem',
        type: 'x',
        classId: '1',
      }),
    ).toEqual(expect.arrayContaining(['name', 'date', 'type', 'classId']));
    expect(
      validateDto(CreateCodeDto, {
        validity: 'ontem',
        score: -1,
        activityId: '1',
      }),
    ).toEqual(expect.arrayContaining(['validity', 'score', 'activityId']));
    expect(
      validateDto(RemoveStudentDto, { classId: '1', studentId: '2' }),
    ).toEqual(expect.arrayContaining(['classId', 'studentId']));
    expect(
      validateDto(EnrollStudentDto, {
        registrationStudent: 'abc',
        joinCode: 'curto',
      }),
    ).toEqual(expect.arrayContaining(['registrationStudent', 'joinCode']));
    expect(validateDto(UpdateClassDto, { teacherId: 'nao-e-uuid' })).toContain(
      'teacherId',
    );
    expect(
      validateDto(UpdateAssessmentDto, { name: '  ', classId: 'x' }),
    ).toEqual(expect.arrayContaining(['name', 'classId']));
    expect(validateDto(UpdateActivityDto, { date: 'ontem' })).toContain('date');
  });

  // Este é o guarda do "não quebrar nada": passa pelo ValidationPipe de verdade,
  // construído igual ao main.ts, porque é lá que uma regressão apareceria — e não
  // na classe isolada. Cada payload é o que o frontend manda hoje.
  it('o ValidationPipe aceita exatamente o que o frontend manda hoje', async () => {
    const pipe = new ValidationPipe(); // idêntico ao main.ts
    const passaPeloPipe = (metatype: any, body: Record<string, unknown>) =>
      pipe.transform(body, { type: 'body', metatype, data: '' });

    await expect(
      // POST /code manda code e active a mais; sem whitelist, precisam passar.
      passaPeloPipe(CreateCodeDto, {
        activityId: uuid,
        validity: '2030-05-10T23:59:59.000Z',
        score: 10,
        code: '',
        active: true,
      }),
    ).resolves.toMatchObject({ activityId: uuid, score: 10 });
    await expect(
      passaPeloPipe(CreateActivityDto, {
        name: 'Seminário',
        date: '2030-05-10T23:59:59.000Z',
        type: 'seminar',
        classId: uuid,
      }),
    ).resolves.toMatchObject({ classId: uuid });
    // PUT /activity/:id manda só name, date e type.
    await expect(
      passaPeloPipe(UpdateActivityDto, {
        name: 'Seminário',
        date: '2030-05-10T23:59:59.000Z',
        type: 'activity',
      }),
    ).resolves.toMatchObject({ name: 'Seminário' });
    await expect(
      passaPeloPipe(CreateAssessmentDto, { name: 'Avaliação 1', classId: uuid }),
    ).resolves.toMatchObject({ classId: uuid });
    await expect(
      passaPeloPipe(EnrollStudentDto, {
        registrationStudent: '123456',
        joinCode: 'A1B2C3D4E5',
      }),
    ).resolves.toMatchObject({ joinCode: 'A1B2C3D4E5' });
    await expect(
      passaPeloPipe(UpdateClassDto, { name: 'Turma 2026.2' }),
    ).resolves.toMatchObject({ name: 'Turma 2026.2' });
    await expect(
      passaPeloPipe(RemoveStudentDto, {
        classId: uuid,
        registrationStudent: '123456',
      }),
    ).resolves.toMatchObject({ classId: uuid });
  });

  it('o ValidationPipe rejeita o que os novos validators proíbem', async () => {
    const pipe = new ValidationPipe();
    await expect(
      pipe.transform(
        { name: 'Avaliação 1', classId: 'nao-e-uuid' },
        { type: 'body', metatype: CreateAssessmentDto, data: '' },
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
});
