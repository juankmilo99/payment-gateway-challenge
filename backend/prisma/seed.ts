import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // await prisma.product.deleteMany(); // Do not clear to avoid FK errors with previous tests

  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Wireless Headphones',
        description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
        price: 29900,
        stock: 5,
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with blue switches.',
        price: 12000,
        stock: 15,
      },
      {
        name: '4K Ultra HD Smart TV',
        description: '55-inch 4K Smart TV with HDR and built-in streaming apps.',
        price: 45000,
        stock: 3,
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Adjustable lumbar support and breathable mesh back.',
        price: 19900,
        stock: 10,
      },
      {
        name: 'Bluetooth Portable Speaker',
        description: 'Waterproof speaker with 12 hours of playtime.',
        price: 5900,
        stock: 20,
      }
    ]
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
