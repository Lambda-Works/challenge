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

  @Matches(/^\+?54\d{9,10}$/, {
    message:
      'El teléfono debe ser en formato argentino: +54XXXXXXXXX o 54XXXXXXXXX',
  })
  phone!: string;
}
