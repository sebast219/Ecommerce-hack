const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeUserAdmin() {
  try {
    const email = 'sebayepa219@gmail.com';
    
    // Get current user data
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('👤 Usuario actual:');
    console.log(JSON.stringify(user, null, 2));

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true
      }
    });

    console.log('\n✅ Usuario convertido a ADMIN exitosamente:');
    console.log(JSON.stringify(updatedUser, null, 2));

    console.log('\n🎯 Ahora el usuario tiene acceso a:');
    console.log('- Dashboard de administración');
    console.log('- Gestión de productos');
    console.log('- Gestión de usuarios');
    console.log('- Panel de administración completo');

  } catch (error) {
    console.error('❌ Error al convertir usuario en admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeUserAdmin();
