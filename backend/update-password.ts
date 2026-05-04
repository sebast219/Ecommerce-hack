import * as bcrypt from 'bcrypt';

async function generatePasswordHash() {
  const password = 'admin123';
  const saltRounds = 12;
  
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password hash for admin123:');
  console.log(hash);
}

generatePasswordHash().catch(console.error);
