import prisma from '../config/prisma.js';
import redisClient from '../config/redis.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';

const getMachines = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value };

    const machines = await prisma.machines.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        machinePrice: {
          include: {
            machinePriceParams: true,
          },
        },
      },
    });

    const total = await prisma.machines.count({ where });

    // const formattedMachines = machines.map((machine) => ({
    //   ...machine,
    //   machinePrice:
    //     machine.machinePrice.length > 0 ? machine.machinePrice[0] : null, // Birinchi elementni olish
    // }));

    const data = formattedMachines.map((machine) => {
      const { nameRu, nameUz, nameEn, ...rest } = machine;
      rest.name = lang == 'uz' ? nameUz : nameRu;
      return rest;
    });

    return {
      data,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit,
      },
    };
  } catch (error) {
    throw error;
  }
};

const createMachine = async (newUser) => {
  try {
    return await prisma.machines.create({
      data: newUser,
    });
  } catch (error) {
    throw error;
  }
};

const getMachineById = async (lang, id) => {
  try {
    const cacheKey = `machine:${id}:${lang}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const machine = await prisma.machines.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new Error('Machine not found');
    }

    const adjustName = (obj) => {
      return {
        ...obj,
        name: lang === 'ru' ? obj.nameRu : obj.nameUz,
      };
    };

    const result = adjustName(machine);
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });

    return result;
  } catch (error) {
    throw error;
  }
};

const updateMachineById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.machines.update({
      where: { id },
      data: machineData,
    });

    if (!updatedUser) {
      throw new Error('Machine not found');
    }

    deleteMachineCache(id);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const deleteMachineById = async (id) => {
  try {
    const result = await prisma.machines.delete({
      where: { id },
    });

    deleteMachineCache(id);

    return result;
  } catch (error) {
    throw error;
  }
};

const getMachinesIdAnName = async () => {
  return await prisma.machines.findMany({
    select: {
      id: true,
      title: true,
    },
  });
};

async function deleteMachineCache(id) {
  const pattern = `machine:${id}:*`; // Barcha `machine:${id}:lang` kalitlarni topadi
  const keys = await redisClient.keys(pattern); // Barcha mos kalitlarni qaytaradi

  if (keys.length > 0) {
    await redisClient.del(keys); // Topilgan kalitlarni o‘chiradi
  }
}

export default {
  getMachines,
  createMachine,
  updateMachineById,
  deleteMachineById,
  getMachinesIdAnName,
  getMachineById,
};
