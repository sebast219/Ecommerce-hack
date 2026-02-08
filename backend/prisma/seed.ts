import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cybersecurity.com' },
    update: {},
    create: {
      email: 'admin@cybersecurity.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@cybersecurity.com' },
    update: {},
    create: {
      email: 'user@cybersecurity.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create cybersecurity products
  const products = [
    {
      name: 'USB Rubber Ducky',
      description: 'Advanced USB attack tool for penetration testing. Programmable keystroke injection device.',
      price: 59.99,
      stock: 25,
      category: 'USB Tools',
      imageUrl: 'https://example.com/rubber-ducky.jpg',
    },
    {
      name: 'WiFi Pineapple',
      description: 'Professional wireless network auditing platform for security professionals.',
      price: 299.99,
      stock: 10,
      category: 'Network Devices',
      imageUrl: 'https://example.com/wifi-pineapple.jpg',
    },
    {
      name: 'Bash Bunny',
      description: 'Multi-function USB attack tool with automated payload execution.',
      price: 99.99,
      stock: 15,
      category: 'USB Tools',
      imageUrl: 'https://example.com/bash-bunny.jpg',
    },
    {
      name: 'LAN Turtle',
      description: 'Stealth network access tool for remote network penetration testing.',
      price: 79.99,
      stock: 20,
      category: 'Network Devices',
      imageUrl: 'https://example.com/lan-turtle.jpg',
    },
    {
      name: 'Packet Squirrel',
      description: 'Portable network analysis and manipulation tool.',
      price: 129.99,
      stock: 12,
      category: 'Network Devices',
      imageUrl: 'https://example.com/packet-squirrel.jpg',
    },
    {
      name: 'Key Croc',
      description: 'Keylogger with advanced keystroke injection capabilities.',
      price: 49.99,
      stock: 30,
      category: 'USB Tools',
      imageUrl: 'https://example.com/key-croc.jpg',
    },
    {
      name: 'Signal Owl',
      description: 'Wireless network reconnaissance and analysis tool.',
      price: 89.99,
      stock: 18,
      category: 'Network Devices',
      imageUrl: 'https://example.com/signal-owl.jpg',
    },
    {
      name: 'Plunder Bug',
      description: 'Voice and data interception device for security testing.',
      price: 39.99,
      stock: 25,
      category: 'Audio Tools',
      imageUrl: 'https://example.com/plunder-bug.jpg',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin@cybersecurity.com / admin123`);
  console.log(`👤 Test user: user@cybersecurity.com / user123`);
  console.log(`📦 Created ${products.length} cybersecurity products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
