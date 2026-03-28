/**
 * Initialize admin user in the database
 * Usage: npx tsx scripts/init-admin.js
 */

import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Initializing admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true },
    });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${existingAdmin.email}`);
      return;
    }

    // Create default admin user
    const hashedPassword = await bcryptjs.hash('admin123456', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@courriers.local',
        name: 'Administrateur',
        password: hashedPassword,
        isAdmin: true,
      },
    });

    console.log(`✓ Admin user created successfully!`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: admin123456`);
    console.log(`\n⚠️  IMPORTANT: Change this default password immediately!`);
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
