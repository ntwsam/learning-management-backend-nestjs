import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create_course.dto';
import { UpdateCourseDto } from './dto/update_course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService){}

    async createCourse(id:number,createCourseDto:CreateCourseDto){
        return this.prisma.courses.create({
            data: {
                name: createCourseDto.name,
                description: createCourseDto.description,
                advisorId: id
            }
        })
    }

    async findAll(){
        const course = await this.prisma.courses.findMany()
        if (!course){
            throw new NotFoundException('Course not found')
        }
        return course
    }

    async findCourse(id:number){
        const course = await this.prisma.courses.findUnique({where:{id}})
        if (!course) {
              throw new NotFoundException('Course not found')
            }
        return course
    }

    async findCourseByAdvisor(id:number){
        const course = await this.prisma.courses.findMany({where:{advisorId:id}})
        if (!course){
            throw new NotFoundException('Course not found')
          }
      return course
    }

    async updateCourse(id:number,updateCourseDto:UpdateCourseDto){
        return this.prisma.courses.update({where:{id},data:updateCourseDto})
    }

    async remove(id: number){
        const course = await this.prisma.courses.findUnique({where:{id}})
        if (!course) {
            throw new NotFoundException('Course not found')
        }
        await this.prisma.courses.delete({where:{id}})
        return {message: `Delete course with ID ${id} successfully`}
    }
}
