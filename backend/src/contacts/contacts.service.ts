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

  async findAll(search?: string, favorite?: boolean, sortBy?: string) {
    const where: any = {};

    // Filtro de búsqueda por texto (se usará para los conteos también)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 1. Obtener conteos contextuales a la búsqueda (independiente del filtro de pestaña)
    const [totalCount, favoriteCount] = await Promise.all([
      this.prisma.contact.count({ where }),
      this.prisma.contact.count({ where: { ...where, isFavorite: true } }),
    ]);

    // 2. Aplicar filtro de favoritos si está activo para la lista de datos
    if (favorite !== undefined) {
      where.isFavorite = favorite;
    }

    // 3. Obtener contactos (el ordenamiento fino lo hacemos en JS para que sea case-insensitive)
    const contacts = await this.prisma.contact.findMany({ where });

    // 4. Ordenamiento manual (case-insensitive)
    contacts.sort((a, b) => {
      // Favoritos siempre primero como prioridad máxima
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }

      // Criterio secundario elegido por el usuario
      switch (sortBy) {
        case 'name_desc':
          return b.name.localeCompare(a.name, 'es', { sensitivity: 'base' });
        case 'created_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'updated_desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name_asc':
        default:
          return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      }
    });

    // Pequeño fix: el sortBy default es name_asc
    if (!sortBy || sortBy === 'name_asc') {
      contacts.sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      });
    }

    return {
      contacts,
      totalCount,
      favoriteCount,
    };
  }

  async toggleFavorite(id: number) {
    const contact = await this.findOne(id);
    return await this.prisma.contact.update({
      where: { id },
      data: { isFavorite: !contact.isFavorite },
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
