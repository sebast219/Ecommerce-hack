import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@ecommerce.com' },
    update: {},
    create: {
      email: 'user@ecommerce.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
    },
  });

  // Create categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
    },
  });

  const booksCategory = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Books',
      slug: 'books',
      description: 'Books and educational materials',
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Laptop Pro 15"',
        slug: 'laptop-pro-15',
        description: 'High-performance laptop with 15-inch display',
        price: 1299.99,
        sku: 'LAPTOP-001',
        categoryId: electronicsCategory.id,
        images: ['/images/laptop-1.jpg', '/images/laptop-2.jpg'],
        tags: ['laptop', 'computer', 'electronics'],
        isActive: true,
      },
      {
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        price: 29.99,
        sku: 'MOUSE-001',
        categoryId: electronicsCategory.id,
        images: ['/images/mouse-1.jpg'],
        tags: ['mouse', 'wireless', 'accessories'],
        isActive: true,
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 19.99,
        sku: 'SHIRT-001',
        categoryId: clothingCategory.id,
        images: ['/images/shirt-1.jpg', '/images/shirt-2.jpg'],
        tags: ['clothing', 'cotton', 'casual'],
        isActive: true,
      },
      {
        name: 'JavaScript Guide',
        slug: 'javascript-guide',
        description: 'Complete guide to modern JavaScript development',
        price: 39.99,
        sku: 'BOOK-001',
        categoryId: booksCategory.id,
        images: ['/images/book-1.jpg'],
        tags: ['programming', 'javascript', 'education'],
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create inventory for products
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    await prisma.productInventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        quantity: Math.floor(Math.random() * 100) + 10,
        lowStock: 5,
        track: true,
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log('Admin user: admin@ecommerce.com / admin123');
  console.log('Regular user: user@ecommerce.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
