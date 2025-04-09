import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/auth/dto/register_user.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {}
