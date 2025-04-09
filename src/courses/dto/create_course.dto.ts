import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {

    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    readonly description: string
}