import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verificando datos reales en la base de datos...\n');

  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const orders = await prisma.order.count();
  const categories = await prisma.category.count();

  console.log(`Usuarios: ${users}`);
  console.log(`Productos: ${products}`);
  console.log(`Pedidos: ${orders}`);
  console.log(`Categorías: ${categories}\n`);

  if (orders > 0) {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        customerName: true,
      },
    });
    console.log('Pedidos recientes:');
    recentOrders.forEach(order => {
      console.log(`- ${order.orderNumber}: ${order.status} - $${order.total} - ${order.customerName}`);
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
