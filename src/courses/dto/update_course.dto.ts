import { PartialType } from "@nestjs/mapped-types";
import { CreateCourseDto } from "./create_course.dto";

export class UpdateCourseDto extends PartialType(CreateCourseDto){}