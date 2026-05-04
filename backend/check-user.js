const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'sebayepa219@gmail.com'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (user) {
      console.log('Usuario encontrado:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('No se encontró ningún usuario con el email sebayepa219@gmail.com');
    }

    // List all users for verification
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      },
      take: 10
    });
    
    console.log('\nPrimeros 10 usuarios en la base de datos:');
    allUsers.forEach(u => {
      console.log(`- ${u.email} (${u.firstName} ${u.lastName})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
