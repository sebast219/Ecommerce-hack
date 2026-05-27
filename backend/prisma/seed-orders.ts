import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creando pedidos de prueba para el dashboard...');

  // Obtener usuarios y productos existentes
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    take: 5,
  });

  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 10,
  });

  if (users.length === 0) {
    console.log('No hay usuarios, creando uno de prueba...');
    const user = await prisma.user.create({
      data: {
        email: 'customer@test.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'USER',
        isVerified: true,
        experienceLevel: 'BEGINNER',
        certifications: '[]',
      },
    });
    users.push(user);
  }

  if (products.length === 0) {
    console.log('No hay productos, por favor ejecuta seed-simple.ts primero');
    return;
  }

  // Crear pedidos con diferentes estados y fechas
  const statuses = ['COMPLETED', 'PAID', 'PENDING', 'SHIPPED', 'DELIVERED'];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];
    const product = products[i % products.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
        userId: user.id,
        status: status,
        subtotal: product.price,
        tax: product.price * 0.16,
        shipping: 9.99,
        total: product.price * 1.16 + 9.99,
        customerEmail: user.email,
        customerName: `${user.firstName} ${user.lastName}`,
        createdAt: orderDate,
        paidAt: status === 'COMPLETED' || status === 'PAID' ? orderDate : null,
        shippedAt: status === 'SHIPPED' || status === 'DELIVERED' ? new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
        deliveredAt: status === 'DELIVERED' ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
        items: {
          create: {
            productId: product.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: product.price,
          },
        },
      },
    });

    console.log(`Pedido ${order.orderNumber} creado (${status})`);
  }

  console.log('Pedidos de prueba creados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
