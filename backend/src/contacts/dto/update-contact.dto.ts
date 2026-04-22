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
  @Matches(/^\+?54\d{9,10}$/, {
    message:
      'El teléfono debe ser en formato argentino: +54XXXXXXXXX o 54XXXXXXXXX',
  })
  phone?: string;
}
