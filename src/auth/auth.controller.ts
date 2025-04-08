import { Controller, Post, Body, HttpStatus, HttpCode, Res, Req, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register_user.dto';
import { AdminRegisterDto } from './dto/register_admin.dto'
import { AuthService } from './auth.service';
import { Users } from '@prisma/client';
import { Public } from './public.decorator';
import { LoginDto } from './dto/login.dot';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    async register(@Body() registerDto: RegisterDto): Promise<Users> {
        return this.authService.createUser(registerDto)
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('admin/signup')
    async adminRegister(@Body() adminRegisterDto: AdminRegisterDto): Promise<Users> {
        return this.authService.createAdmin(adminRegisterDto)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto): Promise<any> {
        const { accessToken, refreshToken, message } = await this.authService.login(loginDto)
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.setHeader('Authorization', `Bearer ${accessToken}`)
        return message
    }

    @HttpCode(HttpStatus.OK)
    @Post('signout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new UnauthorizedException('Access token not provided')
        }
        await this.authService.logout(token)
        res.clearCookie('refresh_token')
        return { message: 'Logged out succesfully' }
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies.refresh_token
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided')
        }
        const accessToken = req.headers.authorization?.split(' ')[1]
        if (!accessToken) {
            throw new UnauthorizedException('Access token not provided')
        }
        const { newAccessToken, newRefreshToken, message } = await this.authService.refresh(accessToken,refreshToken)
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.setHeader('Authorization', `Bearer ${newAccessToken}`)
        return message
    }

    // @Roles(Role.admin)
    // @Get('admin')
    // async admin(){}

    // @Get('protect')
}
