import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export enum Role {
    instructor = 'instructor',
    student = 'student',
}

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly firstname: string

    @IsNotEmpty()
    @IsString()
    readonly lastname: string

    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @MinLength(6)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        }
    )
    readonly password: string

    @IsNotEmpty()
    @IsEnum(Role)
    readonly role: Role
}