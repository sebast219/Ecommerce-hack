const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAvatar() {
  try {
    const email = 'sebayepa219@gmail.com';
    
    // Get user with avatar info
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true
      }
    });

    if (user) {
      console.log('Usuario encontrado:');
      console.log(JSON.stringify(user, null, 2));
      
      if (user.avatar) {
        console.log('\nAvatar URL en BD:', user.avatar);
        console.log('URL completa:', `http://localhost:3001/api/v1${user.avatar}`);
        
        // Check if file exists
        const fs = require('fs');
        const path = require('path');
        const avatarPath = path.join(__dirname, 'uploads', 'avatars', user.avatar.replace('/uploads/avatars/', ''));
        
        console.log('\nRuta física del archivo:', avatarPath);
        
        if (fs.existsSync(avatarPath)) {
          const stats = fs.statSync(avatarPath);
          console.log('✅ Archivo existe');
          console.log('📁 Tamaño:', stats.size, 'bytes');
          console.log('📅 Modificado:', stats.mtime);
        } else {
          console.log('❌ Archivo NO existe en el servidor');
          
          // List all files in uploads/avatars directory
          const avatarsDir = path.join(__dirname, 'uploads', 'avatars');
          if (fs.existsSync(avatarsDir)) {
            console.log('\n📁 Archivos en uploads/avatars:');
            const files = fs.readdirSync(avatarsDir);
            files.forEach(file => {
              const filePath = path.join(avatarsDir, file);
              const stats = fs.statSync(filePath);
              console.log(`  - ${file} (${stats.size} bytes)`);
            });
          } else {
            console.log('❌ Directorio uploads/avatars no existe');
          }
        }
      } else {
        console.log('❌ Usuario no tiene avatar en la BD');
      }
    } else {
      console.log('❌ Usuario no encontrado');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAvatar();
