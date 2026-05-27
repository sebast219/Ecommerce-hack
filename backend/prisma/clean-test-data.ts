import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Eliminando datos de prueba...');

  // Eliminar pedidos de prueba (ORD-000001 a ORD-000020)
  const deletedOrders = await prisma.order.deleteMany({
    where: {
      orderNumber: {
        startsWith: 'ORD-0000',
      },
    },
  });

  console.log(`Pedidos eliminados: ${deletedOrders.count}`);

  // Eliminar usuario de prueba
  const deletedUser = await prisma.user.deleteMany({
    where: {
      email: 'customer@test.com',
    },
  });

  console.log(`Usuario de prueba eliminado: ${deletedUser.count}`);

  console.log('Datos de prueba eliminados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
