import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUsers() {
  console.log('Creando usuarios administradores...');

  try {
    // Crear contraseña hasheada
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // Crear administrador 1
    const admin1 = await prisma.user.upsert({
      where: { email: 'admin@cybersec-store.com' },
      update: { 
        role: 'ADMIN',
        isVerified: true 
      },
      create: {
        email: 'admin@cybersec-store.com',
        password: adminPassword,
        firstName: 'Cyber',
        lastName: 'Admin',
        role: 'ADMIN',
        isVerified: true,
        experienceLevel: 'EXPERT',
        certifications: JSON.stringify(['CISSP', 'CEH', 'OSCP']),
      },
    });

    // Crear administrador 2 (alternativo)
    const admin2 = await prisma.user.upsert({
      where: { email: 'administrator@hack6.com' },
      update: { 
        role: 'ADMIN',
        isVerified: true 
      },
      create: {
        email: 'administrator@hack6.com',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        isVerified: true,
        experienceLevel: 'EXPERT',
        certifications: JSON.stringify(['OSCP', 'GSEC', 'CISSP']),
      },
    });

    console.log('✅ Administradores creados exitosamente:');
    console.log('📧 admin@cybersec-store.com');
    console.log('🔑 Contraseña: admin123');
    console.log('');
    console.log('📧 administrator@hack6.com');
    console.log('🔑 Contraseña: admin123');
    console.log('');
    console.log('🔐 Ambos usuarios tienen rol ADMIN y están verificados');

  } catch (error) {
    console.error('❌ Error creando administradores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUsers();
