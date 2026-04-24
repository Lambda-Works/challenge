import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name!: string;

  @IsEmail()
  email!: string;

  @Matches(/^(\+?54)?9?\d{10}$/, {
    message: 'Formato de teléfono no válido para Argentina',
  })
  phone!: string;
}
