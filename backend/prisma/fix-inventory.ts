import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing inventory to match user-view stock levels...');

  // Map product SKUs to their correct stock levels (from user view)
  const correctStockLevels: Record<string, number> = {
    'AV-ENT-001': 0,        // Antivirus Enterprise - Agotado
    'YUBIKEY-5NFC-001': 0,  // YubiKey 5 NFC - Agotado
    'HAK5-FIELD-KIT': 11,   // Hak5 Field Kit - (11)
    'HAK5-PB001': 48,       // Plunder Bug - (48)
    'HAK5-SC001': 47,       // Screen Crab - (47)
    'HAK5-SJ001': 13,       // Shark Jack - (13)
    'OMG-ELITE-001': 28,    // O.MG Cable Elite - (28)
    'HAK5-KC001': 31,       // Key Croc - (31)
    'HAK5-SO001': 55,       // Signal Owl - (55)
    'HAK5-PS001': 23,       // Packet Squirrel - (23)
    'HAK5-LT001': 32,       // LAN Turtle - (32)
    'HAK5-BB002': 17,       // Bash Bunny Mark II - (17)
    'HAK5-WP007': 19,       // WiFi Pineapple Mark VII - (19)
    'HAK5-RD001': 33,       // USB Rubber Ducky - (33)
  };

  const products = await prisma.product.findMany();

  for (const product of products) {
    const correctStock = correctStockLevels[product.sku];
    
    if (correctStock !== undefined) {
      await prisma.productInventory.upsert({
        where: { productId: product.id },
        update: { quantity: correctStock },
        create: {
          productId: product.id,
          quantity: correctStock,
          lowStock: 5,
          track: true,
        },
      });
      
      console.log(`✓ Updated ${product.name} (${product.sku}): stock = ${correctStock}`);
    } else {
      console.log(`? No stock data for ${product.name} (${product.sku}), skipping`);
    }
  }

  console.log('\n=== Inventory fixed successfully ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
