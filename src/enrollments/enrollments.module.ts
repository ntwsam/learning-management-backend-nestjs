import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({imports:[
    PrismaModule,
    forwardRef(() => CoursesModule),
  ],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
  exports: [EnrollmentsService]
})
export class EnrollmentsModule {}
