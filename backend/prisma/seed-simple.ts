import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Crear categorías
  const cryptoCategory = await prisma.category.create({
    data: {
      name: 'Criptografía',
      slug: 'cryptography',
      description: 'Herramientas y soluciones de cifrado y seguridad criptográfica',
    },
  });

  const softwareCategory = await prisma.category.create({
    data: {
      name: 'Software',
      slug: 'software',
      description: 'Software de seguridad y análisis',
    },
  });

  // Crear administradores (solo 2 como solicitaste)
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.createMany({
    data: [
      {
        email: 'admin1@ecommerce.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'One',
        role: 'ADMIN',
        isVerified: true,
        experienceLevel: 'EXPERT',
        certifications: JSON.stringify(['CISSP', 'CEH']),
      },
      {
        email: 'admin2@ecommerce.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'Two',
        role: 'ADMIN',
        isVerified: true,
        experienceLevel: 'EXPERT',
        certifications: JSON.stringify(['OSCP', 'GSEC']),
      },
    ],
  });

  // Crear algunos productos de ejemplo
  await prisma.product.createMany({
    data: [
      {
        name: 'YubiKey 5 NFC',
        slug: 'yubikey-5-nfc',
        description: 'Llave de seguridad hardware FIDO2/U2F con soporte NFC',
        price: 49.99,
        sku: 'YUBIKEY-5NFC-001',
        categoryId: cryptoCategory.id,
        images: JSON.stringify(['https://www.yubico.com/']),
        tags: JSON.stringify(['cryptography', '2fa', 'hardware-key', 'fido2']),
        compatibility: JSON.stringify(['windows', 'linux', 'mac', 'android']),
        tutorials: JSON.stringify(['https://www.yubico.com/support/']),
        isActive: true,
        difficulty: 'INTERMEDIATE',
        isPhysical: true,
      },
      {
        name: 'Antivirus Enterprise',
        slug: 'antivirus-enterprise',
        description: 'Solución de antivirus empresarial con protección en tiempo real',
        price: 89.99,
        sku: 'AV-ENT-001',
        categoryId: softwareCategory.id,
        images: JSON.stringify(['https://example.com/antivirus.jpg']),
        tags: JSON.stringify(['antivirus', 'malware', 'enterprise']),
        compatibility: JSON.stringify(['windows', 'linux', 'mac']),
        tutorials: JSON.stringify(['https://example.com/tutorials']),
        isActive: true,
        difficulty: 'BEGINNER',
        isPhysical: false,
        licenseType: 'commercial',
        downloadUrl: 'https://example.com/download',
      },
    ],
  });

  console.log('Seed completado exitosamente!');
  console.log('Administradores creados:');
  console.log('- admin1@ecommerce.com (password: admin123)');
  console.log('- admin2@ecommerce.com (password: admin123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
