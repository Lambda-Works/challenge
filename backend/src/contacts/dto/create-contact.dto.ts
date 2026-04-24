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

  @Matches(/^(?:\+?54)?[\s\-]?9?[\s\-]?(?:\d[\s\-]?){10,13}$/, {
    message: 'El teléfono debe tener entre 10 y 13 dígitos',
  })
  phone!: string;
}
