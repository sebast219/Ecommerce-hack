const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmins() {
  try {
    console.log('Creando administradores...');
    
    // Crear admin1
    const admin1Password = await bcrypt.hash('admin123', 10);
    const admin1 = await prisma.user.upsert({
      where: { email: 'admin1@ecommerce.com' },
      update: {},
      create: {
        email: 'admin1@ecommerce.com',
        firstName: 'Admin',
        lastName: 'One',
        password: admin1Password,
        role: 'ADMIN',
        isVerified: true,
        certifications: '[]'
      }
    });
    console.log('Admin 1 creado:', admin1.email);

    // Crear admin2
    const admin2Password = await bcrypt.hash('admin123', 10);
    const admin2 = await prisma.user.upsert({
      where: { email: 'admin2@ecommerce.com' },
      update: {},
      create: {
        email: 'admin2@ecommerce.com',
        firstName: 'Admin',
        lastName: 'Two',
        password: admin2Password,
        role: 'ADMIN',
        isVerified: true,
        certifications: '[]'
      }
    });
    console.log('Admin 2 creado:', admin2.email);

    console.log('Administradores creados exitosamente!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmins();
