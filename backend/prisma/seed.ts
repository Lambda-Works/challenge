import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar contactos existentes
  await prisma.contact.deleteMany({});
  console.log('✓ Deleted all contacts');

  // Crear contactos de prueba
  const contacts = [
    {
      name: 'Juan Pérez',
      email: 'juan@gmail.com',
      phone: '+541112345678',
      isFavorite: false,
    },
    {
      name: 'María García',
      email: 'maria@gmail.com',
      phone: '+541123456789',
      isFavorite: false,
    },
    {
      name: 'Carlos López',
      email: 'carlos@gmail.com',
      phone: '+541134567890',
      isFavorite: false,
    },
    {
      name: 'Ana Martínez',
      email: 'ana@gmail.com',
      phone: '+541145678901',
      isFavorite: false,
    },
    {
      name: 'Luis Fernández',
      email: 'luis@gmail.com',
      phone: '+541156789012',
      isFavorite: false,
    },
  ];

  for (const contact of contacts) {
    const created = await prisma.contact.create({
      data: contact,
    });
    console.log(`✓ Created contact: ${created.name}`);
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
