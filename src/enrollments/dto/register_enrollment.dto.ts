import { IsNotEmpty, IsNumber } from "class-validator";

export class RegisterEnrollmentDto{

    @IsNotEmpty()
    @IsNumber()
    readonly courseId: number
}