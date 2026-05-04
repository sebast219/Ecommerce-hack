const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const email = 'sebayepa219@gmail.com';
    const newPassword = 'Sebast2190.';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: {
        email: email
      },
      data: {
        password: hashedPassword
      }
    });

    console.log(`✅ Contraseña actualizada exitosamente para el usuario: ${email}`);
    console.log(`📧 Email: ${updatedUser.email}`);
    console.log(`👤 Nombre: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`🔑 Nueva contraseña: ${newPassword}`);
    console.log(`⏰ Actualizado: ${new Date().toISOString()}`);
    
    // Verify the update
    const verifyUser = await prisma.user.findUnique({
      where: { email },
      select: { email: true, firstName: true, lastName: true, updatedAt: true }
    });
    
    console.log(`✅ Verificación exitosa - Usuario actualizado:`, verifyUser);

  } catch (error) {
    console.error('❌ Error al actualizar la contraseña:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
