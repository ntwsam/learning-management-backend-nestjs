import { Expose } from "class-transformer"
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export enum Role {
    instructor = 'instructor',
    student = 'student',
}

export class RegisterDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly firstname: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly lastname: string

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @Expose()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        }
    )
    readonly password: string

    @Expose()
    @IsNotEmpty()
    @IsEnum(Role)
    readonly role: Role
}