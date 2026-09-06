import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany(); // Clear existing
  
  await prisma.product.create({
    data: {
      name: 'Premium Wireless Headphones',
      description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
      price: 29900, // $299.00 in cents
      stock: 5,
    },
  });
  
  console.log('Database seeded with test products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
