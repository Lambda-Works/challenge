import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^(?:\+?54)?[\s\-]?9?[\s\-]?(?:\d[\s\-]?){10,13}$/, {
    message: 'El teléfono debe tener entre 10 y 13 dígitos',
  })
  phone?: string;
}
