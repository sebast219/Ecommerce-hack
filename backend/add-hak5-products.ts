import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Agregando productos de Hak5...');

  // Crear u obtener categorías
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

  console.log('✓ Categorías verificadas/creadas');

  const hak5Products = [
    {
      name: 'USB Rubber Ducky',
      slug: 'usb-rubber-ducky',
      description: 'Dispositivo USB avanzado que se comporta como un teclado humano para inyección automatizada de keystrokes. Ideal para pruebas de penetración y auditorías de seguridad.',
      price: 79.99,
      sku: 'HAK5-RD001',
      categoryId: usbCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/usb-rubber-ducky']),
      tags: JSON.stringify(['usb', 'keystroke-injection', 'pentesting', 'hak5']),
      isActive: true,
      difficulty: 'INTERMEDIATE',
      isPhysical: true,
      compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
      tutorials: JSON.stringify(['https://docs.hak5.org/ducky']),
    },
    {
      name: 'WiFi Pineapple Mark VII',
      slug: 'wifi-pineapple-mark-vii',
      description: 'Plataforma avanzada para auditorías de redes WiFi con capacidades de Rogue AP, Karma attacks, y análisis de tráfico inalámbrico.',
      price: 299.99,
      sku: 'HAK5-WP007',
      categoryId: wirelessCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/wifi-pineapple']),
      tags: JSON.stringify(['wifi', 'rogue-ap', 'karma', 'wireless-audit', 'hak5']),
      isActive: true,
      difficulty: 'ADVANCED',
      isPhysical: true,
      compatibility: JSON.stringify(['Web Interface']),
      tutorials: JSON.stringify(['https://docs.hak5.org/wifi-pineapple']),
    },
    {
      name: 'Bash Bunny Mark II',
      slug: 'bash-bunny-mark-ii',
      description: 'Dispositivo USB multi-ataque con emulación de storage, teclado y red. Ejecuta payloads personalizados para pruebas de seguridad automatizadas.',
      price: 99.99,
      sku: 'HAK5-BB002',
      categoryId: usbCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/bash-bunny']),
      tags: JSON.stringify(['usb', 'multi-attack', 'payloads', 'automation', 'hak5']),
      isActive: true,
      difficulty: 'INTERMEDIATE',
      isPhysical: true,
      compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
      tutorials: JSON.stringify(['https://docs.hak5.org/bash-bunny']),
    },
    {
      name: 'LAN Turtle',
      slug: 'lan-turtle',
      description: 'Dispositivo de pentesting de red en formato adaptador Ethernet. Permite acceso remoto persistente y auditorías de red interna.',
      price: 79.99,
      sku: 'HAK5-LT001',
      categoryId: networkCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/lan-turtle']),
      tags: JSON.stringify(['network', 'ethernet', 'remote-access', 'pentesting', 'hak5']),
      isActive: true,
      difficulty: 'INTERMEDIATE',
      isPhysical: true,
      compatibility: JSON.stringify(['Ethernet Networks']),
      tutorials: JSON.stringify(['https://docs.hak5.org/lan-turtle']),
    },
    {
      name: 'Packet Squirrel',
      slug: 'packet-squirrel',
      description: 'Dispositivo de pentesting de red portable con capacidades de man-in-the-middle, packet capture y network attacks.',
      price: 129.99,
      sku: 'HAK5-PS001',
      categoryId: networkCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/packet-squirrel']),
      tags: JSON.stringify(['network', 'mitm', 'packet-capture', 'pentesting', 'hak5']),
      isActive: true,
      difficulty: 'ADVANCED',
      isPhysical: true,
      compatibility: JSON.stringify(['Ethernet Networks']),
      tutorials: JSON.stringify(['https://docs.hak5.org/packet-squirrel']),
    },
    {
      name: 'Signal Owl',
      slug: 'signal-owl',
      description: 'Dispositivo inalámbrico de pentesting con capacidades WiFi, Bluetooth y análisis de radiofrecuencia en formato compacto.',
      price: 149.99,
      sku: 'HAK5-SO001',
      categoryId: wirelessCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/signal-owl']),
      tags: JSON.stringify(['wifi', 'bluetooth', 'rf', 'wireless-audit', 'hak5']),
      isActive: true,
      difficulty: 'INTERMEDIATE',
      isPhysical: true,
      compatibility: JSON.stringify(['WiFi', 'Bluetooth']),
      tutorials: JSON.stringify(['https://docs.hak5.org/signal-owl']),
    },
    {
      name: 'Key Croc',
      slug: 'key-croc',
      description: 'Dispositivo de keylogging con capacidades de keystroke injection y ataques de BadUSB. Se inserta entre teclado y computadora.',
      price: 79.99,
      sku: 'HAK5-KC001',
      categoryId: usbCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/key-croc']),
      tags: JSON.stringify(['keylogger', 'keystroke-injection', 'usb', 'hak5']),
      isActive: true,
      difficulty: 'BEGINNER',
      isPhysical: true,
      compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
      tutorials: JSON.stringify(['https://docs.hak5.org/key-croc']),
    },
    {
      name: 'O.MG Cable Elite',
      slug: 'omg-cable-elite',
      description: 'Cable USB aparentemente normal con implante WiFi integrado. Permite ejecución remota de payloads, keylogging y exfiltración de datos sin detección.',
      price: 179.99,
      sku: 'OMG-ELITE-001',
      categoryId: usbCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/omg-cable']),
      tags: JSON.stringify(['usb', 'implant', 'wifi', 'keylogger', 'covert']),
      isActive: true,
      difficulty: 'INTERMEDIATE',
      isPhysical: true,
      compatibility: JSON.stringify(['USB Devices']),
      tutorials: JSON.stringify(['https://docs.hak5.org/omg-cable']),
    },
    {
      name: 'Shark Jack',
      slug: 'shark-jack',
      description: 'Implante de red portátil para reconocimiento rápido. Se conecta a cualquier puerto Ethernet y ejecuta payloads automáticamente para mapeo de red.',
      price: 49.99,
      sku: 'HAK5-SJ001',
      categoryId: hardwareCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/shark-jack']),
      tags: JSON.stringify(['network', 'recon', 'ethernet', 'portable', 'hak5']),
      isActive: true,
      difficulty: 'BEGINNER',
      isPhysical: true,
      compatibility: JSON.stringify(['Ethernet Networks']),
      tutorials: JSON.stringify(['https://docs.hak5.org/shark-jack']),
    },
    {
      name: 'Screen Crab',
      slug: 'screen-crab',
      description: 'Implante HDMI que captura capturas de pantalla y video en tiempo real. Se inserta entre monitor y computadora sin ser detectado.',
      price: 129.99,
      sku: 'HAK5-SC001',
      categoryId: hardwareCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/screen-crab']),
      tags: JSON.stringify(['hdmi', 'screen-capture', 'covert', 'implant']),
      isActive: true,
      difficulty: 'INTERMEDIATE',
      isPhysical: true,
      compatibility: JSON.stringify(['HDMI']),
      tutorials: JSON.stringify(['https://docs.hak5.org/screen-crab']),
    },
    {
      name: 'Plunder Bug',
      slug: 'plunder-bug',
      description: 'Tap de red inline para captura pasiva de paquetes. Compatible con aplicaciones móviles de análisis de tráfico. Transparente para la red.',
      price: 39.99,
      sku: 'HAK5-PB001',
      categoryId: hardwareCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/products/plunder-bug']),
      tags: JSON.stringify(['network', 'tap', 'packet-capture', 'passive']),
      isActive: true,
      difficulty: 'BEGINNER',
      isPhysical: true,
      compatibility: JSON.stringify(['Ethernet Networks']),
      tutorials: JSON.stringify(['https://docs.hak5.org/plunder-bug']),
    },
    {
      name: 'Hak5 Field Kit',
      slug: 'hak5-field-kit',
      description: 'Kit completo de pentesting físico: WiFi Pineapple Nano + Bash Bunny + LAN Turtle + Signal Owl en un maletín profesional. Todo lo necesario para un red team engagement.',
      price: 599.99,
      sku: 'HAK5-FIELD-KIT',
      categoryId: redTeamCategory.id,
      images: JSON.stringify(['https://shop.hak5.org/collections/bundles']),
      tags: JSON.stringify(['bundle', 'field-kit', 'red-team', 'professional', 'hak5']),
      isActive: true,
      difficulty: 'ADVANCED',
      isPhysical: true,
      compatibility: JSON.stringify(['Multiple']),
      tutorials: JSON.stringify(['https://docs.hak5.org/field-kit']),
    },
  ];

  let createdCount = 0;
  let updatedCount = 0;

  for (const product of hak5Products) {
    try {
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug },
      });

      if (existing) {
        await prisma.product.update({
          where: { slug: product.slug },
          data: product,
        });
        updatedCount++;
        console.log(`✓ Actualizado: ${product.name}`);
      } else {
        await prisma.product.create({
          data: product,
        });
        createdCount++;
        console.log(`✓ Creado: ${product.name}`);
      }
    } catch (error) {
      console.error(`✗ Error con ${product.name}:`, error);
    }
  }

  // Crear inventario para los productos
  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: hak5Products.map(p => p.slug),
      },
    },
  });

  for (const product of products) {
    await prisma.productInventory.upsert({
      where: { productId: product.id },
      update: { quantity: 50 },
      create: {
        productId: product.id,
        quantity: 50,
        lowStock: 5,
        track: true,
      },
    });
  }

  console.log('\n=== Resumen ===');
  console.log(`Productos creados: ${createdCount}`);
  console.log(`Productos actualizados: ${updatedCount}`);
  console.log(`Total productos de Hak5: ${products.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
