import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  // Region qo'shish
  await prisma.region.create({
    data: {
      nameUz: 'Toshkent',
      nameRu: 'Ташкент',
      status: 1,
    },
  });

  // Structure qo'shish
  await prisma.structure.createMany({
    data: [
      {
        nameUz: 'Chilonzor',
        nameRu: 'Чиланзар',
        status: 1,
      },
      {
        nameUz: 'Yunusobod',
        nameRu: 'Юнусобод',
        status: 1,
      },
    ],
  });

  // Driver qo‘shish
  await prisma.driver.create({
    data: {
      name: 'Hasan Dev',
      phone: '+998901234567',
      status: 1,
    },
  });

  // Machine qo‘shish
  await prisma.machines.create({
    data: {
      nameUz: 'traktor',
      nameRu: 'трактор',
      img: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSwjIaq0P27X12DW05FdVGU-N7xwQnrx0Rdqj77GN_NAZv911vB_heNd456ywr3I16Qojse_l79mGB4LeyL&s=19',
      status: 1,
    },
  });

  await prisma.machineParams.createMany({
    data: [
      {
        nameUz: "Og'irlik",
        nameRu: 'Масса',
        nameEn: 'Ton',
        prefix: 'T',
        machineId: 1,
        status: 1,
        params: [
          {
            param: 10,
            amount: 0,
          },
          {
            param: 20,
            amount: 2000,
          },
          {
            param: 30,
            amount: 2500,
          },
          {
            param: 40,
            amount: 3000,
          },
        ],
      },
      {
        nameUz: 'Uzunlik',
        nameRu: 'Длина',
        nameEn: 'length',
        prefix: 'L',
        machineId: 1,
        status: 1,
        params: [
          {
            param: 10,
            amount: 0,
          },
          {
            param: 20,
            amount: 2000,
          },
          {
            param: 30,
            amount: 2500,
          },
          {
            param: 40,
            amount: 3000,
          },
        ],
      },
    ],
  });

  await prisma.machineParamsFilters.createMany({
    data: [
      {
        machineId: 1,
        filterParams: [
          {
            ton: 10,
            length: 20,
          },
          {
            ton: 20,
            length: 30,
          },
          {
            ton: 30,
            length: 40,
          },
          {
            ton: 20,
            length: 20,
          },
          {
            ton: 30,
            length: 40,
          },
        ],
        status: 1,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// npx prisma db seed
