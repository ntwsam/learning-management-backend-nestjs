import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from 'src/role/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCourseDto } from './dto/create_course.dto';
import { Request } from 'express';
import { UpdateCourseDto } from './dto/update_course.dto';
import { plainToInstance } from 'class-transformer';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService:CoursesService){}

    @Roles(Role.admin)
    @Get()
    async findAll(){
        return this.coursesService.findAll()
    }
    
    @Roles(Role.instructor)
    @Post('create')
    async create(@Req() req:Request, @Body() createCourseDto:CreateCourseDto) {
        const user = req['user']
        const id = user.userId
        const allowedKeys = Object.getOwnPropertyNames(new CreateCourseDto())
        const receivedKeys = Object.keys(createCourseDto)
        const invalidKeys = receivedKeys.filter((key)=>!allowedKeys.includes(key))
        if (invalidKeys.length>0){
            throw new BadRequestException(`Unexpected fields in request: ${invalidKeys}`)
        }
        return this.coursesService.createCourse(+id,createCourseDto);
    }

    @Roles(Role.instructor)
    @Get('myCourse')
    async myCourse(@Req() req:Request){
        const user = req['user']
        const id = user.userId
        return this.coursesService.findCourseByAdvisor(+id)
    }

    @Roles(Role.admin)
    @Get(':id')
    async findById(@Param('id') id:number){
        return this.coursesService.findCourse(+id)
    }

    @Roles(Role.instructor,Role.admin)
    @Patch(':id')
    async update(@Param('id') id:number, @Req() req:Request, @Body() updateCourseDto:UpdateCourseDto){
        const user = req['user']
        const role = user.role
        const userId = user.userId
        if (role !== Role.admin){
            const course = await this.coursesService.findCourse(+id)
            const advisorId = course.advisorId
            if (userId !== advisorId){
                throw new UnauthorizedException('You not have permission')
            }
        }
        const dtoInstance = plainToInstance(UpdateCourseDto,updateCourseDto,{excludeExtraneousValues:true})
        const allowedKeys = Object.keys(dtoInstance)
        const receivedKeys = Object.keys(updateCourseDto)
        const invalidKeys = receivedKeys.filter(key => !allowedKeys.includes(key))
        if (invalidKeys.length>0){
            throw new BadRequestException(`Unexpected fields in request: ${invalidKeys}`)
        }
        return this.coursesService.updateCourse(+id,updateCourseDto)
    }

    @Roles(Role.instructor,Role.admin)
    @Delete(':id')
    async remove(@Param('id') id:number, @Req() req:Request){
        const user = req['user']
        const role = user.role
        const userId = user.userId
        if (role !== Role.admin){
            const course = await this.coursesService.findCourse(+id)
            const advisorId = course.advisorId
            if (userId !== advisorId){
                throw new UnauthorizedException('You not have permission')
            }
        }
        return this.coursesService.remove(+id)
    }
}
