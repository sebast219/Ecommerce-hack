"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const productsToUpload = [
    {
        name: 'USB Rubber Ducky',
        slug: 'usb-rubber-ducky',
        description: 'Herramienta de inyección de teclado HID para automatizar pulsaciones y pruebas de seguridad.',
        price: 79.99,
        comparePrice: 99.99,
        cost: 45.0,
        sku: 'USB-DUCKY-001',
        barcode: '9876543210987',
        trackInventory: true,
        isActive: true,
        images: ['https://images-na.ssl-images-amazon.com/images/I/51dC6+xS8XL._SX679_.jpg'],
        tags: ['ciberseguridad', 'hacking', 'pentesting', 'hid'],
        weight: 0.02,
        dimensions: '90x20x7 mm',
        seoTitle: 'USB Rubber Ducky - Automación de pruebas de seguridad',
        seoDescription: 'Dispositivo USB de inyección de teclado para pruebas de penetración y automatización de comandos.',
        difficulty: 'INTERMEDIATE',
        licenseType: 'OPEN_SOURCE',
        compatibility: ['Windows', 'Linux', 'macOS'],
        requirements: 'Puerto USB disponible',
        tutorials: ['https://github.com/hak5darren/USB-Rubber-Ducky/wiki'],
        isPhysical: true,
        categorySlug: 'ciberseguridad',
        categoryName: 'Ciberseguridad',
    },
    {
        name: 'Kit de Pentesting Wireless',
        slug: 'kit-pentesting-wireless',
        description: 'Equipo portátil para auditorías de red Wi-Fi y análisis de vulnerabilidades.',
        price: 249.0,
        comparePrice: 299.0,
        cost: 150.0,
        sku: 'KIT-WIFI-002',
        barcode: '1234509876123',
        trackInventory: true,
        isActive: true,
        images: ['https://example.com/images/kit-pentesting-wireless.jpg'],
        tags: ['wifi', 'penetration-testing', 'seguridad', 'hardware'],
        weight: 1.3,
        dimensions: '220x150x50 mm',
        seoTitle: 'Kit de Pentesting Wireless - Auditoría Wi-Fi profesional',
        seoDescription: 'Conjunto de dispositivos para análisis y ataques éticos en redes inalámbricas.',
        difficulty: 'ADVANCED',
        licenseType: 'COMMERCIAL',
        compatibility: ['Kali Linux', 'Parrot OS'],
        requirements: 'Conexión USB y adaptadores compatibles',
        tutorials: ['https://example.com/tutorials/kit-pentesting-wireless'],
        isPhysical: true,
        categorySlug: 'hardware-seguridad',
        categoryName: 'Hardware de Seguridad',
    },
    {
        name: 'Firewall Virtual Enterprise',
        slug: 'firewall-virtual-enterprise',
        description: 'Licencia anual para firewall virtual con análisis de tráfico y prevención de intrusiones.',
        price: 399.0,
        comparePrice: 499.0,
        cost: 180.0,
        sku: 'FW-VIRTUAL-003',
        barcode: '9876501234987',
        trackInventory: false,
        isActive: true,
        images: ['https://example.com/images/firewall-virtual-enterprise.jpg'],
        tags: ['software', 'seguridad', 'firewall', 'enterprise'],
        weight: 0.0,
        dimensions: '0x0x0',
        seoTitle: 'Firewall Virtual Enterprise - Seguridad de red avanzada',
        seoDescription: 'Solución digital para protección de redes, VPN y análisis de amenazas en tiempo real.',
        difficulty: 'ADVANCED',
        licenseType: 'PROPRIETARY',
        compatibility: ['Linux', 'Docker'],
        requirements: 'Servidor con Linux y acceso root',
        tutorials: ['https://example.com/tutorials/firewall-virtual-enterprise'],
        isPhysical: false,
        downloadUrl: 'https://example.com/download/firewall-virtual-enterprise',
        categorySlug: 'software-seguridad',
        categoryName: 'Software de Seguridad',
    },
    {
        name: 'Suscripción VPN Corporativa 1 Año',
        slug: 'suscripcion-vpn-corporativa-1-ano',
        description: 'Servicio VPN empresarial con ancho de banda ilimitado y servidores ubicados globalmente.',
        price: 129.99,
        comparePrice: 159.99,
        cost: 70.0,
        sku: 'VPN-CORP-004',
        barcode: '1122334455667',
        trackInventory: false,
        isActive: true,
        images: ['https://example.com/images/vpn-corporativa.jpg'],
        tags: ['vpn', 'seguridad', 'privacidad', 'redes'],
        weight: 0.0,
        dimensions: '0x0x0',
        seoTitle: 'VPN Corporativa 1 Año - Conexión segura global',
        seoDescription: 'VPN empresarial para protección de datos y acceso seguro desde cualquier ubicación.',
        difficulty: 'BEGINNER',
        licenseType: 'SUBSCRIPTION',
        compatibility: ['Windows', 'Linux', 'macOS', 'Android', 'iOS'],
        requirements: 'Cliente VPN compatible',
        tutorials: ['https://example.com/tutorials/vpn-corporativa'],
        isPhysical: false,
        downloadUrl: 'https://example.com/download/vpn-corporativa',
        categorySlug: 'servicios-digitales',
        categoryName: 'Servicios Digitales',
    },
    {
        name: 'Cámara IP Oculta 4K',
        slug: 'camara-ip-oculta-4k',
        description: 'Cámara IP de vigilancia con resolución 4K, visión nocturna y transmisión en vivo.',
        price: 179.99,
        comparePrice: 219.99,
        cost: 95.0,
        sku: 'CAM-IP-005',
        barcode: '2233445566778',
        trackInventory: true,
        isActive: true,
        images: ['https://example.com/images/camara-ip-oculta-4k.jpg'],
        tags: ['vigilancia', 'hardware', '4k', 'seguridad'],
        weight: 0.45,
        dimensions: '110x45x35 mm',
        seoTitle: 'Cámara IP Oculta 4K - Vigilancia discreta',
        seoDescription: 'Cámara compacta con transmisión en vivo y grabación en alta definición.',
        difficulty: 'INTERMEDIATE',
        licenseType: 'COMMERCIAL',
        compatibility: ['Android', 'iOS', 'Windows'],
        requirements: 'Red Wi-Fi de 2.4GHz',
        tutorials: ['https://example.com/tutorials/camara-ip-oculta-4k'],
        isPhysical: true,
        categorySlug: 'hardware-seguridad',
        categoryName: 'Hardware de Seguridad',
    },
    {
        name: 'Curso de Hacking Ético Básico',
        slug: 'curso-hacking-etico-basico',
        description: 'Curso en línea con módulos prácticos para aprender pentesting, herramientas y tácticas éticas.',
        price: 89.99,
        comparePrice: 129.99,
        cost: 20.0,
        sku: 'CURSO-ETH-006',
        barcode: '3344556677889',
        trackInventory: false,
        isActive: true,
        images: ['https://example.com/images/curso-hacking-etico-basico.jpg'],
        tags: ['curso', 'hacking', 'pentesting', 'educación'],
        weight: 0.0,
        dimensions: '0x0x0',
        seoTitle: 'Curso de Hacking Ético Básico - Aprende pentesting',
        seoDescription: 'Curso digital para profesionales que desean iniciar en auditorías de seguridad y hacking ético.',
        difficulty: 'BEGINNER',
        licenseType: 'DIGITAL',
        compatibility: ['Web'],
        requirements: 'Navegador moderno y conexión a internet',
        tutorials: ['https://example.com/courses/hacking-etico-basico'],
        isPhysical: false,
        downloadUrl: 'https://example.com/access/curso-hacking-etico-basico',
        categorySlug: 'educacion-seguridad',
        categoryName: 'Educación en Seguridad',
    },
    {
        name: 'Servidor NAS Protegido 8TB',
        slug: 'servidor-nas-protegido-8tb',
        description: 'Almacenamiento en red con cifrado integrado, copias de seguridad automáticas y acceso remoto seguro.',
        price: 499.0,
        comparePrice: 549.0,
        cost: 320.0,
        sku: 'NAS-SEC-007',
        barcode: '4455667788990',
        trackInventory: true,
        isActive: true,
        images: ['https://example.com/images/servidor-nas-protegido-8tb.jpg'],
        tags: ['nas', 'almacenamiento', 'seguridad', 'hardware'],
        weight: 5.4,
        dimensions: '220x150x180 mm',
        seoTitle: 'Servidor NAS Protegido 8TB - Backup cifrado',
        seoDescription: 'Dispositivo NAS con cifrado de datos y acceso seguro para equipos de trabajo.',
        difficulty: 'INTERMEDIATE',
        licenseType: 'COMMERCIAL',
        compatibility: ['Windows', 'Linux', 'macOS'],
        requirements: 'Red Ethernet y fuente de alimentación',
        tutorials: ['https://example.com/tutorials/servidor-nas-protegido'],
        isPhysical: true,
        categorySlug: 'hardware-seguridad',
        categoryName: 'Hardware de Seguridad',
    },
    {
        name: 'API de Escaneo de Vulnerabilidades',
        slug: 'api-escaneo-vulnerabilidades',
        description: 'Acceso API para análisis automático de vulnerabilidades en aplicaciones web y servicios.',
        price: 269.99,
        comparePrice: 329.99,
        cost: 110.0,
        sku: 'API-SEC-008',
        barcode: '5566778899001',
        trackInventory: false,
        isActive: true,
        images: ['https://example.com/images/api-escaneo-vulnerabilidades.jpg'],
        tags: ['api', 'seguridad', 'vulnerabilidades', 'desarrollo'],
        weight: 0.0,
        dimensions: '0x0x0',
        seoTitle: 'API de Escaneo de Vulnerabilidades - Análisis seguro',
        seoDescription: 'Servicio API para identificar fallos de seguridad en aplicaciones web y servicios backend.',
        difficulty: 'ADVANCED',
        licenseType: 'SUBSCRIPTION',
        compatibility: ['REST', 'JSON'],
        requirements: 'Clave API válida',
        tutorials: ['https://example.com/tutorials/api-escaneo-vulnerabilidades'],
        isPhysical: false,
        downloadUrl: 'https://example.com/docs/api-escaneo-vulnerabilidades',
        categorySlug: 'servicios-digitales',
        categoryName: 'Servicios Digitales',
    },
    {
        name: 'Paquete Auditoría de Contraseñas',
        slug: 'paquete-auditoria-contraseñas',
        description: 'Herramientas y guías para evaluar la solidez de contraseñas y políticas de acceso.',
        price: 59.99,
        comparePrice: 79.99,
        cost: 25.0,
        sku: 'PASS-AUD-009',
        barcode: '6677889900112',
        trackInventory: false,
        isActive: true,
        images: ['https://example.com/images/paquete-auditoria-contrasenas.jpg'],
        tags: ['seguridad', 'contraseñas', 'auditoría', 'software'],
        weight: 0.0,
        dimensions: '0x0x0',
        seoTitle: 'Paquete Auditoría de Contraseñas - Evaluación y mejoras',
        seoDescription: 'Conjunto digital para revisar la seguridad de contraseñas y prácticas de acceso en entornos corporativos.',
        difficulty: 'INTERMEDIATE',
        licenseType: 'DIGITAL',
        compatibility: ['Windows', 'Linux', 'macOS'],
        requirements: 'Computadora con acceso a internet',
        tutorials: ['https://example.com/tutorials/paquete-auditoria-contrasenas'],
        isPhysical: false,
        downloadUrl: 'https://example.com/download/paquete-auditoria-contrasenas',
        categorySlug: 'software-seguridad',
        categoryName: 'Software de Seguridad',
    },
    {
        name: 'Guía de Cumplimiento GDPR y PCI',
        slug: 'guia-cumplimiento-gdpr-pci',
        description: 'Documento técnico con mejores prácticas para cumplir normativas de protección de datos.',
        price: 34.99,
        comparePrice: 49.99,
        cost: 10.0,
        sku: 'GUIDE-COMP-010',
        barcode: '7788990011223',
        trackInventory: false,
        isActive: true,
        images: ['https://example.com/images/guia-cumplimiento-gdpr-pci.jpg'],
        tags: ['cumplimiento', 'gdpr', 'pci', 'documentación'],
        weight: 0.0,
        dimensions: '0x0x0',
        seoTitle: 'Guía de Cumplimiento GDPR y PCI - Normas y controles',
        seoDescription: 'Guía descargable con procesos críticos para proteger datos y cumplir regulaciones.',
        difficulty: 'BEGINNER',
        licenseType: 'DIGITAL',
        compatibility: ['Web', 'PDF'],
        requirements: 'Lector de PDF o navegador',
        tutorials: ['https://example.com/tutorials/guia-cumplimiento-gdpr-pci'],
        isPhysical: false,
        downloadUrl: 'https://example.com/download/guia-cumplimiento-gdpr-pci',
        categorySlug: 'educacion-seguridad',
        categoryName: 'Educación en Seguridad',
    },
];
function normalizeString(value) {
    if (value === undefined) {
        return undefined;
    }
    return Array.isArray(value) ? JSON.stringify(value) : value;
}
async function ensureCategory(slug, name) {
    const categorySlug = slug.trim().toLowerCase();
    let category = await prisma.category.findFirst({
        where: { slug: categorySlug },
    });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name: name ?? categorySlug.replace(/[-_]/g, ' '),
                slug: categorySlug,
                description: `Categoria auto-creada: ${name ?? categorySlug}`,
            },
        });
        console.log('Category created:', { id: category.id, slug: category.slug });
    }
    return category;
}
async function createProducts(products) {
    if (products.length === 0) {
        console.log('No products to upload.');
        return;
    }
    const payloads = [];
    for (const product of products) {
        const categorySlug = product.categorySlug ?? 'uncategorized';
        const category = await ensureCategory(categorySlug, product.categoryName);
        payloads.push({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            comparePrice: product.comparePrice,
            cost: product.cost,
            sku: product.sku,
            barcode: product.barcode,
            trackInventory: product.trackInventory ?? true,
            isActive: product.isActive ?? true,
            images: normalizeString(product.images) ?? '[]',
            tags: normalizeString(product.tags) ?? '[]',
            weight: product.weight,
            dimensions: product.dimensions,
            seoTitle: product.seoTitle,
            seoDescription: product.seoDescription,
            difficulty: product.difficulty ?? 'BEGINNER',
            licenseType: product.licenseType,
            compatibility: normalizeString(product.compatibility) ?? '[]',
            requirements: product.requirements,
            tutorials: normalizeString(product.tutorials) ?? '[]',
            isPhysical: product.isPhysical ?? true,
            downloadUrl: product.downloadUrl,
            categoryId: category.id,
        });
    }
    const result = await prisma.product.createMany({
        data: payloads,
        skipDuplicates: true,
    });
    console.log(`Products uploaded: ${result.count}`);
    // Create inventory for uploaded products
    for (const product of products) {
        const existingProduct = await prisma.product.findUnique({
            where: { slug: product.slug },
        });
        if (existingProduct) {
            const existingInventory = await prisma.productInventory.findUnique({
                where: { productId: existingProduct.id },
            });
            if (!existingInventory) {
                await prisma.productInventory.create({
                    data: {
                        productId: existingProduct.id,
                        quantity: 50,
                        lowStock: 5,
                        track: true,
                    },
                });
                console.log(`Inventory created for product: ${product.name} (Stock: 50)`);
            }
            else {
                console.log(`Inventory already exists for product: ${product.name}`);
            }
        }
    }
}
async function main() {
    console.log('Starting product upload script...');
    await createProducts(productsToUpload);
    console.log('Product upload script finished.');
}
main()
    .catch((error) => {
    console.error('Error in product upload:', error);
})
    .finally(async () => {
    await prisma.$disconnect();
});
