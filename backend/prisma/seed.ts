import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Enums locales para el seed
enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

enum ProductDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cybersec-store.com' },
    update: {},
    create: {
      email: 'admin@cybersec-store.com',
      password: hashedPassword,
      firstName: 'Cyber',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  
  const regularUser = await prisma.user.upsert({
    where: { email: 'hacker@pro.com' },
    update: {},
    create: {
      email: 'hacker@pro.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  });

  // Create cybersecurity categories
  const wirelessCategory = await prisma.category.upsert({
    where: { slug: 'wireless-attacks' },
    update: {},
    create: {
      name: 'Ataques Inalámbricos',
      slug: 'wireless-attacks',
      description: 'Herramientas para auditorías WiFi, Bluetooth y redes inalámbricas',
      image: '/images/categories/wireless.jpg',
    },
  });

  const usbCategory = await prisma.category.upsert({
    where: { slug: 'usb-hacking' },
    update: {},
    create: {
      name: 'USB Hacking',
      slug: 'usb-hacking',
      description: 'Dispositivos USB para pentesting y ataques de BadUSB',
      image: '/images/categories/usb.jpg',
    },
  });

  const redTeamCategory = await prisma.category.upsert({
    where: { slug: 'red-team' },
    update: {},
    create: {
      name: 'Red Team Tools',
      slug: 'red-team',
      description: 'Herramientas ofensivas para simulaciones de ataques avanzados',
      image: '/images/categories/redteam.jpg',
    },
  });

  const networkCategory = await prisma.category.upsert({
    where: { slug: 'network-monitoring' },
    update: {},
    create: {
      name: 'Network Monitoring',
      slug: 'network-monitoring',
      description: 'Sniffers, analizadores de red y herramientas de monitoreo',
      image: '/images/categories/network.jpg',
    },
  });

  const hardwareCategory = await prisma.category.upsert({
    where: { slug: 'hardware-implants' },
    update: {},
    create: {
      name: 'Hardware Implants',
      slug: 'hardware-implants',
      description: 'Dispositivos encubiertos y hardware modificado para pentesting',
      image: '/images/categories/hardware.jpg',
    },
  });

  const forensicsCategory = await prisma.category.upsert({
    where: { slug: 'forensics' },
    update: {},
    create: {
      name: 'Digital Forensics',
      slug: 'forensics',
      description: 'Herramientas para análisis forense digital y recuperación de datos',
      image: '/images/categories/forensics.jpg',
    },
  });

  // Create cybersecurity products
  await prisma.product.createMany({
    data: [
      {
        name: 'USB Rubber Ducky',
        slug: 'usb-rubber-ducky',
        description: 'Dispositivo USB avanzado que se comporta como un teclado humano para inyección automatizada de keystrokes. Ideal para pruebas de penetración y auditorías de seguridad.',
        price: 79.99,
        sku: 'HAK5-RD001',
        categoryId: usbCategory.id,
        images: [
          'https://shop.hak5.org/products/usb-rubber-ducky',
          'https://images-na.ssl-images-amazon.com/images/I/51QlBzBceZL._SL1000_.jpg'
        ],
        tags: ['usb', 'keystroke-injection', 'pentesting', 'hak5'],
                isActive: true,
      },
      {
        name: 'WiFi Pineapple Mark VII',
        slug: 'wifi-pineapple-mark-vii',
        description: 'Plataforma avanzada para auditorías de redes WiFi con capacidades de Rogue AP, Karma attacks, y análisis de tráfico inalámbrico.',
        price: 299.99,
        sku: 'HAK5-WP007',
        categoryId: wirelessCategory.id,
        images: [
          'https://shop.hak5.org/products/wifi-pineapple',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/WiFi-Pineapple-Mark-VII-Base-Unit_1200x1200.jpg'
        ],
        tags: ['wifi', 'rogue-ap', 'karma', 'wireless-audit', 'hak5'],
                                isActive: true,
      },
      {
        name: 'Bash Bunny Mark II',
        slug: 'bash-bunny-mark-ii',
        description: 'Dispositivo USB multi-ataque con emulación de storage, teclado y red. Ejecuta payloads personalizados para pruebas de seguridad automatizadas.',
        price: 99.99,
        sku: 'HAK5-BB002',
        categoryId: usbCategory.id,
        images: [
          'https://shop.hak5.org/products/bash-bunny',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Bash-Bunny-Mark-II_1200x1200.jpg'
        ],
        tags: ['usb', 'multi-attack', 'payloads', 'automation', 'hak5'],
                isActive: true,
      },
      {
        name: 'Flipper Zero',
        slug: 'flipper-zero',
        description: 'Dispositivo multifunción portable para pentesting de radiofrecuencia, RFID, NFC, GPIO y más. Herramienta swiss-army knife para hackers.',
        price: 169.99,
        sku: 'FLIPPER-001',
        categoryId: hardwareCategory.id,
        images: [
          'https://flipperzero.one/',
          'https://cdn.shopify.com/s/files/1/0576/8238/9078/products/flipper-zero-black_1200x1200.jpg'
        ],
        tags: ['rf', 'rfid', 'nfc', 'sub-ghz', 'infrared', 'gpio'],
                licenseType: 'commercial',
        compatibility: ['standalone'],
        requirements: { battery: 'Li-ion 1600mAh', connectivity: 'USB-C, Bluetooth' },
        tutorials: ['https://docs.flipperzero.one'],
                isActive: true,
      },
      {
        name: 'LAN Turtle',
        slug: 'lan-turtle',
        description: 'Dispositivo de pentesting de red en formato adaptador Ethernet. Permite acceso remoto persistente y auditorías de red interna.',
        price: 79.99,
        sku: 'HAK5-LT001',
        categoryId: networkCategory.id,
        images: [
          'https://shop.hak5.org/products/lan-turtle',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/LAN-Turtle_1200x1200.jpg'
        ],
        tags: ['network', 'ethernet', 'remote-access', 'pentesting', 'hak5'],
                licenseType: 'commercial',
        compatibility: ['network'],
        requirements: { ethernet: 'RJ45', power: 'PoE or USB' },
        tutorials: ['https://docs.hak5.org/lan-turtle'],
                isActive: true,
      },
      {
        name: 'Packet Squirrel',
        slug: 'packet-squirrel',
        description: 'Dispositivo de pentesting de red portable con capacidades de man-in-the-middle, packet capture y network attacks.',
        price: 129.99,
        sku: 'HAK5-PS001',
        categoryId: networkCategory.id,
        images: [
          'https://shop.hak5.org/products/packet-squirrel',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Packet-Squirrel_1200x1200.jpg'
        ],
        tags: ['network', 'mitm', 'packet-capture', 'pentesting', 'hak5'],
                licenseType: 'commercial',
        compatibility: ['network'],
        requirements: { ethernet: 'RJ45', power: 'USB or PoE' },
        tutorials: ['https://docs.hak5.org/packet-squirrel'],
                isActive: true,
      },
      {
        name: 'Signal Owl',
        slug: 'signal-owl',
        description: 'Dispositivo inalámbrico de pentesting con capacidades WiFi, Bluetooth y análisis de radiofrecuencia en formato compacto.',
        price: 149.99,
        sku: 'HAK5-SO001',
        categoryId: wirelessCategory.id,
        images: [
          'https://shop.hak5.org/products/signal-owl',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Signal-Owl_1200x1200.jpg'
        ],
        tags: ['wifi', 'bluetooth', 'rf', 'wireless-audit', 'hak5'],
        difficulty: 'ADVANCED',
        licenseType: 'commercial',
        compatibility: ['standalone'],
        requirements: { power: '5V 1A', connectivity: 'WiFi, Bluetooth' },
        tutorials: ['https://docs.hak5.org/signal-owl'],
                isActive: true,
      },
      {
        name: 'Key Croc',
        slug: 'key-croc',
        description: 'Dispositivo de keylogging con capacidades de keystroke injection y ataques de BadUSB. Se inserta entre teclado y computadora.',
        price: 79.99,
        sku: 'HAK5-KC001',
        categoryId: usbCategory.id,
        images: [
          'https://shop.hak5.org/products/key-croc',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Key-Croc_1200x1200.jpg'
        ],
        tags: ['keylogger', 'keystroke-injection', 'usb', 'hak5'],
                licenseType: 'commercial',
        compatibility: ['windows', 'linux', 'mac'],
        requirements: { usb: '2.0+', connection: 'Keyboard passthrough' },
        tutorials: ['https://docs.hak5.org/key-croc'],
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
        quantity: Math.floor(Math.random() * 50) + 10,
        lowStock: 5,
        track: true,
      },
    });
  }

  console.log('Cybersecurity database seeded successfully!');
  console.log('Admin user: admin@cybersec-store.com / admin123');
  console.log('Regular user: hacker@pro.com / user123');
  console.log(`Created ${products.length} cybersecurity products`);
  console.log('Categories: Wireless Attacks, USB Hacking, Red Team, Network Monitoring, Hardware Implants, Digital Forensics');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
