import { Controller, Get, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { Roles } from 'src/role/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(Role.admin)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('myAccount')
  async myAccount(@Req() req: Request) {
    const user = req['user']
    const id = user.userId
    return this.usersService.findOne(+id);
  }

  @Patch('myAccount')
  async updateMyAccount(@Req() req:Request, @Body() updateUserDto:UpdateUserDto){
    const user = req['user']
    const id = user.userId
    const dtoInstance = plainToInstance(UpdateUserDto,updateUserDto,{excludeExtraneousValues:true})
    const allowedKeys = Object.keys(dtoInstance)
    const receivedKeys = Object.keys(updateUserDto)
    const invalidKeys = receivedKeys.filter(key => !allowedKeys.includes(key))
    if (invalidKeys.length>0){
      throw new BadRequestException(`Unexpected fields in request: ${invalidKeys}`)
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.admin)
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Roles(Role.admin)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const dtoInstance = plainToInstance(UpdateUserDto,updateUserDto,{excludeExtraneousValues:true})
    const allowedKeys = Object.keys(dtoInstance)
    const receivedKeys = Object.keys(updateUserDto)
    const invalidKeys = receivedKeys.filter(key => !allowedKeys.includes(key))
    if (invalidKeys.length>0){
      throw new BadRequestException(`Unexpected fields in request: ${invalidKeys}`)
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.admin)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

}
