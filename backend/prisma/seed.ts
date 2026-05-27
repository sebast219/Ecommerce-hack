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
  // Limpieza de datos existentes para evitar duplicados
  console.log('Limpiando datos existentes...');
  await prisma.wishlistItem.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.productInventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // Nota: No eliminamos users para mantener las cuentas existentes
  console.log('Datos limpiados exitosamente');
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
      certifications: 'CISSP, CEH, OSCP',
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
      certifications: 'CompTIA Security+',
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

  // Nuevas categorías
  const physicalSecurityCategory = await prisma.category.upsert({
    where: { slug: 'physical-security' },
    update: {},
    create: {
      name: 'Seguridad Física',
      slug: 'physical-security',
      description: 'Herramientas para bypass de controles de acceso físico, cerraduras y sistemas de seguridad perimetral',
      image: '/images/categories/physical-security.jpg',
    },
  });

  const osintCategory = await prisma.category.upsert({
    where: { slug: 'osint-reconnaissance' },
    update: {},
    create: {
      name: 'OSINT & Reconocimiento',
      slug: 'osint-reconnaissance',
      description: 'Herramientas para inteligencia de fuentes abiertas y reconocimiento de objetivos',
      image: '/images/categories/osint.jpg',
    },
  });

  const cryptoCategory = await prisma.category.upsert({
    where: { slug: 'cryptography' },
    update: {},
    create: {
      name: 'Criptografía',
      slug: 'cryptography',
      description: 'Herramientas de cifrado, descifrado y análisis de sistemas criptográficos',
      image: '/images/categories/cryptography.jpg',
    },
  });

  const malwareAnalysisCategory = await prisma.category.upsert({
    where: { slug: 'malware-analysis' },
    update: {},
    create: {
      name: 'Malware Analysis',
      slug: 'malware-analysis',
      description: 'Entornos sandbox y herramientas para análisis e ingeniería inversa de malware',
      image: '/images/categories/malware-analysis.jpg',
    },
  });

  const socialEngineeringCategory = await prisma.category.upsert({
    where: { slug: 'social-engineering' },
    update: {},
    create: {
      name: 'Social Engineering',
      slug: 'social-engineering',
      description: 'Herramientas para pruebas de ingeniería social y simulación de phishing',
      image: '/images/categories/social-engineering.jpg',
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
        images: JSON.stringify([
          'https://shop.hak5.org/products/usb-rubber-ducky',
          'https://images-na.ssl-images-amazon.com/images/I/51QlBzBceZL._SL1000_.jpg'
        ]),
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
        images: JSON.stringify([
          'https://shop.hak5.org/products/wifi-pineapple',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/WiFi-Pineapple-Mark-VII-Base-Unit_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['wifi', 'rogue-ap', 'karma', 'wireless-audit', 'hak5']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['WiFi', 'Ethernet']),
        tutorials: JSON.stringify(['https://docs.hak5.org/pineapple']),
      },
      {
        name: 'Bash Bunny Mark II',
        slug: 'bash-bunny-mark-ii',
        description: 'Dispositivo USB multi-ataque con emulación de storage, teclado y red. Ejecuta payloads personalizados para pruebas de seguridad automatizadas.',
        price: 99.99,
        sku: 'HAK5-BB002',
        categoryId: usbCategory.id,
        images: JSON.stringify([
          'https://shop.hak5.org/products/bash-bunny',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Bash-Bunny-Mark-II_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['usb', 'multi-attack', 'payloads', 'automation', 'hak5']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
        tutorials: JSON.stringify(['https://docs.hak5.org/bashbunny']),
      },
      {
        name: 'Flipper Zero',
        slug: 'flipper-zero',
        description: 'Dispositivo multifunción portable para pentesting de radiofrecuencia, RFID, NFC, GPIO y más. Herramienta swiss-army knife para hackers.',
        price: 169.99,
        sku: 'FLIPPER-001',
        categoryId: hardwareCategory.id,
        images: JSON.stringify([
          'https://flipperzero.one/',
          'https://cdn.shopify.com/s/files/1/0576/8238/9078/products/flipper-zero-black_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['rf', 'rfid', 'nfc', 'sub-ghz', 'infrared', 'gpio']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['RF', 'RFID', 'NFC', 'Sub-GHz', 'Infrared']),
        tutorials: JSON.stringify(['https://docs.flipperzero.one']),
      },
      {
        name: 'LAN Turtle',
        slug: 'lan-turtle',
        description: 'Dispositivo de pentesting de red en formato adaptador Ethernet. Permite acceso remoto persistente y auditorías de red interna.',
        price: 79.99,
        sku: 'HAK5-LT001',
        categoryId: networkCategory.id,
        images: JSON.stringify([
          'https://shop.hak5.org/products/lan-turtle',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/LAN-Turtle_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['network', 'ethernet', 'remote-access', 'pentesting', 'hak5']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['Ethernet', 'USB']),
        tutorials: JSON.stringify(['https://docs.hak5.org/lanturtle']),
      },
      {
        name: 'Packet Squirrel',
        slug: 'packet-squirrel',
        description: 'Dispositivo de pentesting de red portable con capacidades de man-in-the-middle, packet capture y network attacks.',
        price: 129.99,
        sku: 'HAK5-PS001',
        categoryId: networkCategory.id,
        images: JSON.stringify([
          'https://shop.hak5.org/products/packet-squirrel',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Packet-Squirrel_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['network', 'mitm', 'packet-capture', 'pentesting', 'hak5']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['Ethernet', 'WiFi']),
        tutorials: JSON.stringify(['https://docs.hak5.org/packetsquirrel']),
      },
      {
        name: 'Signal Owl',
        slug: 'signal-owl',
        description: 'Dispositivo inalámbrico de pentesting con capacidades WiFi, Bluetooth y análisis de radiofrecuencia en formato compacto.',
        price: 149.99,
        sku: 'HAK5-SO001',
        categoryId: wirelessCategory.id,
        images: JSON.stringify([
          'https://shop.hak5.org/products/signal-owl',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Signal-Owl_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['wifi', 'bluetooth', 'rf', 'wireless-audit', 'hak5']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['WiFi', 'Bluetooth', 'RF']),
        tutorials: JSON.stringify(['https://docs.hak5.org/signalowl']),
      },
      {
        name: 'Key Croc',
        slug: 'key-croc',
        description: 'Dispositivo de keylogging con capacidades de keystroke injection y ataques de BadUSB. Se inserta entre teclado y computadora.',
        price: 79.99,
        sku: 'HAK5-KC001',
        categoryId: usbCategory.id,
        images: JSON.stringify([
          'https://shop.hak5.org/products/key-croc',
          'https://cdn.shopify.com/s/files/1/0063/9428/2711/products/Key-Croc_1200x1200.jpg'
        ]),
        tags: JSON.stringify(['keylogger', 'keystroke-injection', 'usb', 'hak5']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: true,
        compatibility: JSON.stringify(['USB']),
        tutorials: JSON.stringify(['https://docs.hak5.org/keycroc']),
      },
      // === NUEVOS PRODUCTOS USB HACKING ===
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
        compatibility: JSON.stringify(['USB', 'WiFi']),
        tutorials: JSON.stringify(['https://docs.hak5.org/omgcable']),
      },
      {
        name: 'Rubber Ducky Payload Studio Kit',
        slug: 'rubber-ducky-payload-kit',
        description: 'Kit completo con USB Rubber Ducky + biblioteca de 50+ payloads preconfigurados para Windows, macOS y Linux. Incluye guía de desarrollo de payloads.',
        price: 119.99,
        sku: 'RD-PAYLOAD-KIT',
        categoryId: usbCategory.id,
        images: JSON.stringify(['https://shop.hak5.org/products/usb-rubber-ducky']),
        tags: JSON.stringify(['usb', 'payload', 'bundle', 'keystroke']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: true,
        compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
        tutorials: JSON.stringify(['https://docs.hak5.org/ducky']),
      },
      // === NUEVOS PRODUCTOS ATAQUES INALÁMBRICOS ===
      {
        name: 'WiFi Pineapple Nano',
        slug: 'wifi-pineapple-nano',
        description: 'Versión compacta del WiFi Pineapple para auditorías de campo. Portátil y discreto con todas las capacidades de Rogue AP y análisis de tráfico.',
        price: 99.99,
        sku: 'HAK5-WPN001',
        categoryId: wirelessCategory.id,
        images: JSON.stringify(['https://shop.hak5.org/products/wifi-pineapple']),
        tags: JSON.stringify(['wifi', 'portable', 'rogue-ap', 'audit']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['WiFi']),
        tutorials: JSON.stringify(['https://docs.hak5.org/pineapple']),
      },
      {
        name: 'HackRF One',
        slug: 'hackrf-one',
        description: 'Transceptor SDR (Software Defined Radio) de largo alcance. Captura y transmite señales de radio desde 1MHz hasta 6GHz. Ideal para análisis de RF y replay attacks.',
        price: 329.99,
        sku: 'HACKRF-ONE-001',
        categoryId: wirelessCategory.id,
        images: JSON.stringify(['https://greatscottgadgets.com/hackrf/one/']),
        tags: JSON.stringify(['sdr', 'rf', 'radio', 'replay-attack', 'frequency']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['RF', 'SDR']),
        tutorials: JSON.stringify(['https://greatscottgadgets.com/hackrf/one/']),
      },
      {
        name: 'Alfa Network AWUS036ACH',
        slug: 'alfa-awus036ach',
        description: 'Adaptador WiFi de alta potencia con soporte dual-band AC1200. Compatible con Kali Linux para auditorías WiFi, packet injection y monitor mode.',
        price: 49.99,
        sku: 'ALFA-ACH-001',
        categoryId: wirelessCategory.id,
        images: JSON.stringify(['https://www.alfa.com.tw/products/awus036ach']),
        tags: JSON.stringify(['wifi', 'adapter', 'kali', 'monitor-mode', 'injection']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: true,
        compatibility: JSON.stringify(['WiFi', 'Kali Linux']),
        tutorials: JSON.stringify(['https://www.alfa.com.tw/support/']),
      },
      // === NUEVOS PRODUCTOS HARDWARE IMPLANTS ===
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
        compatibility: JSON.stringify(['Ethernet']),
        tutorials: JSON.stringify(['https://docs.hak5.org/sharkjack']),
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
        tutorials: JSON.stringify(['https://docs.hak5.org/screencrab']),
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
        compatibility: JSON.stringify(['Ethernet']),
        tutorials: JSON.stringify(['https://docs.hak5.org/plunderbug']),
      },
      // === NUEVOS PRODUCTOS RED TEAM TOOLS ===
      {
        name: 'Proxmark3 RDV4',
        slug: 'proxmark3-rdv4',
        description: 'Herramienta profesional para investigación y clonación de RFID/NFC. Soporta LF y HF. Utilizada por pentesters para bypass de control de acceso físico.',
        price: 349.99,
        sku: 'PM3-RDV4-001',
        categoryId: redTeamCategory.id,
        images: JSON.stringify(['https://proxmark.com/']),
        tags: JSON.stringify(['rfid', 'nfc', 'cloning', 'access-control', 'physical']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['RFID', 'NFC']),
        tutorials: JSON.stringify(['https://proxmark.com/docs']),
      },
      {
        name: 'USB Ninja Cable Pro',
        slug: 'usb-ninja-cable-pro',
        description: 'Cable de carga con implante de ataque inalámbrico. Control remoto vía smartphone. Ejecuta keystrokes e inyecta payloads al conectarse.',
        price: 89.99,
        sku: 'NINJA-PRO-001',
        categoryId: redTeamCategory.id,
        images: JSON.stringify(['https://usbninja.com/']),
        tags: JSON.stringify(['usb', 'covert', 'wireless', 'payload', 'physical']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['USB', 'WiFi']),
        tutorials: JSON.stringify(['https://usbninja.com/docs']),
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
        compatibility: JSON.stringify(['WiFi', 'Ethernet', 'USB']),
        tutorials: JSON.stringify(['https://docs.hak5.org/fieldkit']),
      },
      // === NUEVOS PRODUCTOS NETWORK MONITORING ===
      {
        name: 'WiFi Coconut',
        slug: 'wifi-coconut',
        description: 'Monitor simultáneo de todos los canales WiFi 2.4GHz. 14 radios integradas para captura completa del espectro. Ideal para análisis forense inalámbrico.',
        price: 249.99,
        sku: 'HAKSOL-WC001',
        categoryId: networkCategory.id,
        images: JSON.stringify(['https://hak5.org/products/wifi-coconut']),
        tags: JSON.stringify(['wifi', 'monitor', 'spectrum', 'forensics', '2.4ghz']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['WiFi 2.4GHz']),
        tutorials: JSON.stringify(['https://hak5.org/products/wifi-coconut/docs']),
      },
      {
        name: 'Raspberry Pi 4 Pentest Kit',
        slug: 'raspberry-pi-pentest-kit',
        description: 'Raspberry Pi 4 (4GB) preconfigurado con Kali Linux ARM, adaptador WiFi Alfa, case táctico y batería. Servidor de C2 portable y versátil.',
        price: 189.99,
        sku: 'RPI4-PENTEST-001',
        categoryId: networkCategory.id,
        images: JSON.stringify(['https://www.raspberrypi.com/']),
        tags: JSON.stringify(['raspberry-pi', 'kali', 'portable', 'c2', 'server']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['Linux', 'WiFi', 'Ethernet']),
        tutorials: JSON.stringify(['https://www.kali.org/docs/raspberry-pi/']),
      },
      // === NUEVOS PRODUCTOS DIGITAL FORENSICS ===
      {
        name: 'Cellebrite UFED Touch2',
        slug: 'cellebrite-ufed-touch2',
        description: 'Solución forense líder para extracción de datos de dispositivos móviles. Soporta iOS y Android. Utilizada por agencias de ley y equipos forenses corporativos.',
        price: 2499.99,
        sku: 'CBR-UFED-T2',
        categoryId: forensicsCategory.id,
        images: JSON.stringify(['https://www.cellebrite.com/']),
        tags: JSON.stringify(['forensics', 'mobile', 'extraction', 'ios', 'android']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['iOS', 'Android']),
        tutorials: JSON.stringify(['https://www.cellebrite.com/en/training/']),
      },
      {
        name: 'Write Blocker USB 3.0',
        slug: 'write-blocker-usb',
        description: 'Bloqueador de escritura hardware para análisis forense. Previene modificación de evidencia digital durante adquisición. Certificado para uso en tribunales.',
        price: 149.99,
        sku: 'WB-USB3-001',
        categoryId: forensicsCategory.id,
        images: JSON.stringify(['https://www.cru-inc.com/products/wiebetech/']),
        tags: JSON.stringify(['forensics', 'write-blocker', 'evidence', 'legal']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: true,
        compatibility: JSON.stringify(['USB 3.0']),
        tutorials: JSON.stringify(['https://www.cru-inc.com/support/']),
      },
      // === NUEVOS PRODUCTOS SEGURIDAD FISICA ===
      {
        name: 'Lockpick Set Profesional',
        slug: 'lockpick-set-pro',
        description: 'Set completo de lockpicking con 24 piezas: ganzuas, tension wrenches, y pick guns para bypass de cerraduras pin-tumbler y wafer. Incluye case de cuero.',
        price: 89.99,
        sku: 'LOCK-PRO-SET-001',
        categoryId: physicalSecurityCategory.id,
        images: JSON.stringify(['https://www.sparrowslockpicks.com/']),
        tags: JSON.stringify(['lockpicking', 'physical', 'bypass', 'entry']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['Physical Locks']),
        tutorials: JSON.stringify(['https://www.sparrowslockpicks.com/guides/']),
      },
      {
        name: 'RFID Duplicator PM3',
        slug: 'rfid-duplicator-pm3',
        description: 'Duplicador portatil de tarjetas RFID 125KHz. Copia badges de acceso en segundos. Incluye 10 tarjetas T5577 regrabables y llaveros.',
        price: 69.99,
        sku: 'RFID-DUP-PM3-001',
        categoryId: physicalSecurityCategory.id,
        images: JSON.stringify(['https://www.aliexpress.com/']),
        tags: JSON.stringify(['rfid', 'access-control', 'duplication', 'physical']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: true,
        compatibility: JSON.stringify(['RFID 125KHz']),
        tutorials: JSON.stringify(['https://proxmark.com/docs']),
      },
      // === NUEVOS PRODUCTOS OSINT ===
      {
        name: 'Maltego Classic',
        slug: 'maltego-classic',
        description: 'Plataforma lider de OSINT para reconocimiento y analisis de relaciones entre personas, dominios, IPs y redes sociales. Licencia anual.',
        price: 999.99,
        sku: 'MALTEGO-CLASSIC-001',
        categoryId: osintCategory.id,
        images: JSON.stringify(['https://www.maltego.com/']),
        tags: JSON.stringify(['osint', 'reconnaissance', 'intelligence', 'links']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: false,
        licenseType: 'commercial',
        compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
        tutorials: JSON.stringify(['https://docs.maltego.com/']),
      },
      {
        name: 'Shodan Membership',
        slug: 'shodan-membership',
        description: 'Membresia anual a Shodan: el buscador de dispositivos conectados a Internet. Acceso a APIs, busquedas avanzadas y monitoreo de exposicion.',
        price: 49.99,
        sku: 'SHODAN-MEMBER-001',
        categoryId: osintCategory.id,
        images: JSON.stringify(['https://www.shodan.io/']),
        tags: JSON.stringify(['osint', 'iot', 'reconnaissance', 'exposure']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: false,
        licenseType: 'commercial',
        compatibility: JSON.stringify(['Web', 'API']),
        tutorials: JSON.stringify(['https://developer.shodan.io/api']),
      },
      // === NUEVOS PRODUCTOS CRIPTOGRAFIA ===
      {
        name: 'YubiKey 5 NFC',
        slug: 'yubikey-5-nfc',
        description: 'Llave de seguridad hardware FIDO2/U2F con soporte NFC. Autenticacion multifactor, almacenamiento de claves PGP y certificados.',
        price: 49.99,
        sku: 'YUBIKEY-5NFC-001',
        categoryId: cryptoCategory.id,
        images: JSON.stringify(['https://www.yubico.com/']),
        tags: JSON.stringify(['cryptography', '2fa', 'hardware-key', 'fido2']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
        compatibility: JSON.stringify(['USB', 'NFC', 'FIDO2', 'U2F']),
        tutorials: JSON.stringify(['https://support.yubico.com/']),
      },
      {
        name: 'HSM NitroKey Pro',
        slug: 'nitrokey-pro',
        description: 'Hardware Security Module Open Source para almacenamiento seguro de claves criptograficas, firmas de email y cifrado de discos.',
        price: 119.99,
        sku: 'NITROKEY-PRO-001',
        categoryId: cryptoCategory.id,
        images: JSON.stringify(['https://www.nitrokey.com/']),
        tags: JSON.stringify(['cryptography', 'hsm', 'encryption', 'open-source']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: true,
        compatibility: JSON.stringify(['USB', 'OpenPGP', 'S/MIME']),
        tutorials: JSON.stringify(['https://www.nitrokey.com/documentation']),
      },
      // === NUEVOS PRODUCTOS MALWARE ANALYSIS ===
      {
        name: 'REMnux Analysis VM',
        slug: 'remnux-vm-pro',
        description: 'Maquina virtual preconfigurada con toolkit completo para analisis de malware: IDA Pro, Ghidra, Radare2, Cuckoo Sandbox.',
        price: 299.99,
        sku: 'REMNUX-VM-PRO-001',
        categoryId: malwareAnalysisCategory.id,
        images: JSON.stringify(['https://remnux.org/']),
        tags: JSON.stringify(['malware', 'analysis', 'reverse-engineering', 'sandbox']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: false,
        licenseType: 'commercial',
        compatibility: JSON.stringify(['Linux', 'VMware', 'VirtualBox']),
        tutorials: JSON.stringify(['https://remnux.org/docs/']),
      },
      {
        name: 'Ghidra Pro Suite',
        slug: 'ghidra-pro-suite',
        description: 'Entorno de ingenieria inversa avanzado desarrollado por NSA. Incluye decompiladores para x86, ARM, y mas.',
        price: 0.00,
        sku: 'GHIDRA-PRO-001',
        categoryId: malwareAnalysisCategory.id,
        images: JSON.stringify(['https://ghidra-sre.org/']),
        tags: JSON.stringify(['reverse-engineering', 'malware', 'disassembler', 'nsa']),
        isActive: true,
        difficulty: 'ADVANCED',
        isPhysical: false,
        licenseType: 'open-source',
        downloadUrl: 'https://github.com/NationalSecurityAgency/ghidra',
        compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
        tutorials: JSON.stringify(['https://ghidra-sre.org/']),
      },
      // === NUEVOS PRODUCTOS SOCIAL ENGINEERING ===
      {
        name: 'GoPhish Enterprise',
        slug: 'gophish-enterprise',
        description: 'Plataforma de phishing simulation para entrenamiento de empleados. Reportes detallados, templates personalizables, y API REST.',
        price: 499.99,
        sku: 'GOPHISH-ENT-001',
        categoryId: socialEngineeringCategory.id,
        images: JSON.stringify(['https://getgophish.com/']),
        tags: JSON.stringify(['phishing', 'social-engineering', 'training', 'awareness']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: false,
        licenseType: 'commercial',
        compatibility: JSON.stringify(['Web', 'API']),
        tutorials: JSON.stringify(['https://getgophish.com/docs/']),
      },
      {
        name: 'BadUSB Social Kit',
        slug: 'badusb-social-kit',
        description: 'Kit de demostracion de ingenieria social: Rubber Ducky con payloads de HID que simulan teclados para pruebas de concientizacion.',
        price: 149.99,
        sku: 'BADUSB-SOC-001',
        categoryId: socialEngineeringCategory.id,
        images: JSON.stringify(['https://shop.hak5.org/']),
        tags: JSON.stringify(['social-engineering', 'usb', 'awareness', 'training']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: true,
        compatibility: JSON.stringify(['Windows', 'macOS', 'Linux']),
        tutorials: JSON.stringify(['https://docs.hak5.org/ducky']),
      }
    ]),
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
  console.log('Categories: Wireless Attacks, USB Hacking, Red Team, Network Monitoring, Hardware Implants, Digital Forensics, Seguridad Física, OSINT & Reconocimiento, Criptografía, Malware Analysis, Social Engineering');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
