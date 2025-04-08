import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register_user.dto';
import * as bcrypt from 'bcrypt'
import { AdminRegisterDto } from './dto/register_admin.dto';
import { env } from 'process';
import { LoginDto } from './dto/login.dot';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private redisService: RedisService,
    ) { }

    async generateUserTokens(userId: number) {
        const accessToken = this.jwtService.sign({ userId }, { expiresIn: '15m' })
        const refreshToken = this.jwtService.sign({ userId }, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_SECRET
        })
        return { accessToken, refreshToken }
    }

    async createUser(registerDto: RegisterDto) {
        const existingUser = await this.prisma.users.findUnique({
            where: {
                email: registerDto.email
            }
        })
        if (existingUser) {
            throw new BadRequestException('Email already exists')
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10)
        return this.prisma.users.create({
            data: {
                firstname: registerDto.firstname,
                lastname: registerDto.lastname,
                email: registerDto.email,
                password: hashedPassword,
                role: registerDto.role
            }
        })
    }

    async createAdmin(adminRegisterDto: AdminRegisterDto) {
        const existingUser = await this.prisma.users.findUnique({
            where: {
                email: adminRegisterDto.email
            }
        })
        if (existingUser) {
            throw new BadRequestException('Eamil already exists')
        }
        const hashedPassword = await bcrypt.hash(adminRegisterDto.password, 10)
        if (adminRegisterDto.secretKey !== env.ADMIN_SECRET) {
            throw new UnauthorizedException('Secret key not match')
        }
        return this.prisma.users.create({
            data: {
                firstname: adminRegisterDto.firstname,
                lastname: adminRegisterDto.lastname,
                email: adminRegisterDto.email,
                password: hashedPassword,
                role: 'admin'
            }
        })
    }

    async login(loginDto: LoginDto) {
        const existingUser = await this.prisma.users.findUnique({
            where: {
                email: loginDto.email
            }
        })
        if (!existingUser) {
            throw new UnauthorizedException('Invalid Email')
        }
        const checkPassword = await bcrypt.compare(loginDto.password, existingUser?.password)
        if (!checkPassword) {
            throw new UnauthorizedException('Invalid Password')
        }
        const token = await this.generateUserTokens(existingUser.id)
        const accessToken = token.accessToken
        const refreshToken = token.refreshToken

        return {
            message: `Welcome back ${existingUser.firstname} ${existingUser.lastname}`,
            accessToken,
            refreshToken,
        }
    }

    async logout(accessToken: string) {
        const payload = this.jwtService.decode(accessToken) as { exp: number }
        if (!payload || !payload.exp) {
            throw new Error('Invalid access token')
        }
        const now = Math.floor(Date.now() / 1000)
        const ttl = payload.exp - now

        if (ttl > 0) {
            await this.redisService.set(`bl_token:${accessToken}`, 'revoked', ttl)
        }
    }

    async refresh(accessToken: string, refreshToken: string) {
        const refreshPayload = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET, })
        const token = await this.generateUserTokens(refreshPayload.userId)
        const newAccessToken = token.accessToken
        const newRefreshToken = token.refreshToken

        const accessPayload = this.jwtService.decode(accessToken) as { exp: number }
        if (!accessPayload || !accessPayload.exp) {
            throw new Error('Invalid access token')
        }
        const now = Math.floor(Date.now() / 1000)
        const ttl = accessPayload.exp - now

        if (ttl > 0) {
            await this.redisService.set(`bl_token:${accessToken}`, 'revoked', ttl)
        }

        return {
            message: 'Refresh token successfully',
            newAccessToken,
            newRefreshToken,
        }
    }

}

