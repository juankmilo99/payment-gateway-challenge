import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const productsData = [
    {
      name: 'Premium Wireless Headphones',
      description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
      price: 29900,
      stock: 5,
      imageUrl: '/images/headphones.webp'
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches.',
      price: 12000,
      stock: 15,
      imageUrl: '/images/keyboard1.webp'
    },
    {
      name: '4K Ultra HD Smart TV',
      description: '55-inch 4K Smart TV with HDR and built-in streaming apps.',
      price: 45000,
      stock: 3,
      imageUrl: '/images/tv1.jpg'
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Adjustable lumbar support and breathable mesh back.',
      price: 19900,
      stock: 10,
      imageUrl: '/images/silla1.jpg'
    },
    {
      name: 'Bluetooth Portable Speaker',
      description: 'Waterproof speaker with 12 hours of playtime.',
      price: 5900,
      stock: 20,
      imageUrl: '/images/speaker1.webp'
    }
  ];

  for (const p of productsData) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { imageUrl: p.imageUrl }
      });
    } else {
      await prisma.product.create({ data: p });
    }
  }
  
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
