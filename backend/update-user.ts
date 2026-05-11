import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updateUser() {
  try {
    const userEmail = 'sebayepa219@gmail.com';
    const newPassword = 'Syrax2190';
    
    console.log(`Updating user: ${userEmail}`);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        firstName: 'sebastian',
        lastName: 'yepes',
        role: 'ADMIN',
        password: hashedPassword,
        isVerified: true,
        experienceLevel: 'EXPERT',
        certifications: JSON.stringify(['Admin Certification'])
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        experienceLevel: true,
        updatedAt: true
      }
    });
    
    console.log('✅ User updated successfully:');
    console.log(`ID: ${updatedUser.id}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Name: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`Role: ${updatedUser.role}`);
    console.log(`Verified: ${updatedUser.isVerified}`);
    console.log(`Experience Level: ${updatedUser.experienceLevel}`);
    console.log(`Updated: ${updatedUser.updatedAt}`);
    console.log(`New password: ${newPassword}`);
    
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUser();
