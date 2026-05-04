import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdminUser() {
  try {
    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: 'sebayepa219@gmail.com' }
    });

    if (!user) {
      console.log('Usuario no encontrado. Creando nuevo usuario admin...');
      
      // Crear usuario admin si no existe
      const newUser = await prisma.user.create({
        data: {
          email: 'sebayepa219@gmail.com',
          firstName: 'Admin',
          lastName: 'User',
          password: '$2b$12$QXfhDE8ebiLhzdOGM4tT1evcvQr7EFU8YIVSS.8oid3v1oL7i4lP2', // password: admin123
          role: 'ADMIN',
          certifications: 'Admin Access',
        }
      });
      
      console.log('Usuario admin creado:', newUser.email);
    } else {
      console.log('Usuario encontrado:', user.email, '- Rol actual:', user.role);
      
      // Actualizar contraseña y rol a ADMIN
      const updatedUser = await prisma.user.update({
        where: { email: 'sebayepa219@gmail.com' },
        data: { 
          role: 'ADMIN',
          password: '$2b$12$QXfhDE8ebiLhzdOGM4tT1evcvQr7EFU8YIVSS.8oid3v1oL7i4lP2' // password: admin123
        }
      });
      
      console.log('✅ Rol actualizado a ADMIN y contraseña actualizada para:', updatedUser.email);
    }

    console.log('🎉 Listo! Ahora puedes iniciar sesión con:');
    console.log('   Email: sebayepa219@gmail.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminUser();
