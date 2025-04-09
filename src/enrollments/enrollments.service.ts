import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterEnrollmentDto } from './dto/register_enrollment.dto';

@Injectable()
export class EnrollmentsService {
    constructor(private prisma:PrismaService){}

    async findAll(){
        const enrollments = await this.prisma.enrollments.findMany()
        if (!enrollments){
            throw new NotFoundException('Enrollments not found')
        }
        return enrollments
    }

    async findMyEnrollment(id:number){
        const enrollments = await this.prisma.enrollments.findMany({where:{studentId:id}})
        if (!enrollments){
            throw new NotFoundException('Enrollments not found')
        }
        return enrollments
    }

    async findEnrollment(id:number){
        const enrollments = await this.prisma.enrollments.findUnique({where:{id}})
        if (!enrollments) {
            throw new NotFoundException('Course not found')
          }
      return enrollments
    }

    async findMyCourse(id:number[]){
        const enrollments = this.prisma.enrollments.findMany({where:{courseId:{in:id}}})
        if (!enrollments){
            throw new NotFoundException('Course not found')
          }
      return enrollments
    }

    async register(id:number,registerEnrollmentDto:RegisterEnrollmentDto){
        const courseId = registerEnrollmentDto.courseId
        const course = await this.prisma.courses.findUnique({where:{id:courseId}})
        if (!course){
            throw new NotFoundException('Course not found')
        }
        const registed = await this.prisma.enrollments.findUnique({where:{courseId_studentId:{courseId:registerEnrollmentDto.courseId,studentId:id}}})
        if (registed){
            throw new BadRequestException('Already enrolled')
        }
        const enroll = await this.prisma.enrollments.create({
            data:{
                studentId:id,
                courseId:registerEnrollmentDto.courseId
            }
        })
        return enroll
    }

    async remove(id:number){
        const enroll = await this.prisma.enrollments.findUnique({where:{id}})
        if (!enroll){
            throw new NotFoundException('Enrolled not found')
        }
        await this.prisma.enrollments.delete({where:{id}})
        return {message: `Delete enrollment with ID ${id} successfully`}
    }
}
