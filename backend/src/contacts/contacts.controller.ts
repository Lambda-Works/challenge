import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FirebaseAuthGuard } from '../firebase/guards/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
@Controller('api/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactsService.create(createContactDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Contacto creado exitosamente',
      data: contact,
    };
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    const contacts = await this.contactsService.findAll(search);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contactos listados exitosamente',
      data: contacts,
      total: contacts.length,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contacto encontrado',
      data: contact,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const contact = await this.contactsService.update(id, updateContactDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contacto actualizado exitosamente',
      data: contact,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactsService.remove(id);
  }
}
