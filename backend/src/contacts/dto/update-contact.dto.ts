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
  @Matches(/^(\+?54)?9?\d{10}$/, {
    message: 'Formato de teléfono no válido para Argentina',
  })
  phone?: string;
}
