import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentClassModule } from './student_class/student_class.module';
import { CheckinModule } from './checkin/checkin.module';
import { CodeModule } from './code/code.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './activity/activity.module';
import { AssessmentModule } from './assessment/assessment.module';
import { ClassModule } from './class/class.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/migrations/{.ts,*.js}`],
      migrationsRun: true,
    }),
    UserModule,
    StudentModule,
    TeacherModule,
    StudentClassModule,
    CheckinModule,
    CodeModule,
    AuthModule,
    ActivityModule,
    AssessmentModule,
    ClassModule,
  ],
})
export class AppModule {}
