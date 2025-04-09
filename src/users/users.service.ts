import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update_user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findAll() {
    const user = await this.prisma.users.findMany()
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    if (user.role === Role.admin) {
      if (updateUserDto.role) {
        throw new ForbiddenException('Admin is not allowed to change own role')
      }
    }
    const updateData: any = updateUserDto
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.prisma.users.update({ where: { id }, data: updateData })
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    await this.prisma.users.delete({ where: { id } })
    return { message: `Delete user with ID ${id} successfully` }
  }
}
