import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { Roles } from 'src/role/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { CoursesService } from 'src/courses/courses.service';
import { RegisterEnrollmentDto } from './dto/register_enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService:EnrollmentsService,
        private readonly coursesService:CoursesService
    ){}

    @Roles(Role.admin)
    @Get()
    async findAll(){
        return this.enrollmentsService.findAll()
    }

    @Roles(Role.student)
    @Post()
    async register(@Req() req:Request,@Body() registerEnrollmentDto:RegisterEnrollmentDto){
        const user = req['user']
        const id = user.userId
        return this.enrollmentsService.register(+id,registerEnrollmentDto)
    }

    @Get('myEnrollment')
    async myEnroll(@Req() req:Request){
        const user = req['user']
        const role = user.role
        const id = user.userId
        if (role === Role.instructor){
            const course = await this.coursesService.findCourseByAdvisor(+id)
            const courseId = course.map(course => course.id)
            return this.enrollmentsService.findMyCourse(courseId)
        } else {
            return this.enrollmentsService.findMyEnrollment(id)
        }
    }

    @Delete(':id')
    async remove(@Param('id') id:number,@Req() req:Request){
        const user = req['user']
        const role = user.role
        const userId = user.userId
        if (role !== Role.admin){
            if (role === Role.student){
                const enroll = await this.enrollmentsService.findEnrollment(+id)
                const studentId = enroll.studentId
                if (userId !== studentId){
                    throw new UnauthorizedException('You not have permission')
                }
            }else if (role === Role.instructor){
                const course = await this.coursesService.findCourse(+id)
                const advisorId = course.advisorId
                if (userId !== advisorId){
                    throw new UnauthorizedException('You not have permission')
                }
            }
        }
        return this.enrollmentsService.remove(+id)
    }
}
