import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  private prisma = new PrismaClient();

  async create(createContactDto: CreateContactDto) {
    const { email, phone } = createContactDto;

    // Verificar si email ya existe
    const existingEmail = await this.prisma.contact.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si phone ya existe
    const existingPhone = await this.prisma.contact.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      throw new ConflictException('El teléfono ya está registrado');
    }

    return await this.prisma.contact.create({
      data: createContactDto,
    });
  }

  async findAll(search?: string) {
    if (search) {
      return await this.prisma.contact.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              phone: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return await this.prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.findOne(id);

    // Si se intenta actualizar el email, verificar que no exista otro con ese email
    if (updateContactDto.email && updateContactDto.email !== contact.email) {
      const existingEmail = await this.prisma.contact.findUnique({
        where: { email: updateContactDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Si se intenta actualizar el teléfono, verificar que no exista otro con ese teléfono
    if (updateContactDto.phone && updateContactDto.phone !== contact.phone) {
      const existingPhone = await this.prisma.contact.findUnique({
        where: { phone: updateContactDto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('El teléfono ya está registrado');
      }
    }

    return await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.contact.delete({
      where: { id },
    });
  }
}
