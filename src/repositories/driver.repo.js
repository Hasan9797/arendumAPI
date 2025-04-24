import prisma from '../config/prisma.js';
import { getDriverStatusText } from '../enums/driver/driverStatusEnum.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';
import redisClient from '../config/redis.js';

const findAll = async (lang, query) => {
  const { page, limit, sort, filters = [] } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value };

    // Prisma so‘rov
    const drivers = await prisma.driver.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        region: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            status: true,
          },
        },
        structure: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            status: true,
          },
        },
        machine: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
            img: true,
          },
        },
        balance: {
          select: {
            balance: true,
          },
        },
      },
    });

    const total = await prisma.driver.count({ where });

    // Bog‘liq bo‘lmagan ID maydonlarini olib tashlash
    const sanitizedDrivers = drivers.map(
      ({ regionId, structureId, machineId, ...rest }) => rest
    );

    // Ma’lumotlarni formatlash
    const data = sanitizedDrivers.map((driver) => {
      const { region, structure, machine, ...rest } = driver;

      const adjustName = (obj) => {
        if (!obj) return null;
        const { nameRu, nameUz, status, ...relationRest } = obj;
        return {
          ...relationRest,
          name: lang === 'ru' ? nameRu : nameUz,
        };
      };

      return {
        ...rest,
        status: { key: rest.status, value: getDriverStatusText(rest.status) },
        region: adjustName(region),
        structure: adjustName(structure),
        machine: adjustName(machine),
        balance: rest.balance?.balance ?? '0',
      };
    });

    // Natijani qaytarish
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

const create = async (newDriver) => {
  try {
    return await prisma.driver.create({
      data: newDriver,
    });
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        balance: {
          select: {
            balance: true,
          },
        },
      },
    });
    return {
      balance: driver?.balance?.balance ?? '0',
      ...driver,
    };
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, driverData) => {
  try {
    const cacheKey = `driver_${id}`;

    const updatedUser = await prisma.driver.update({
      where: { id },
      data: driverData,
    });

    // 2. Redis cache'dan o‘chirish (agar bo‘lsa)
    await redisClient.del(cacheKey);

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const cacheKey = `driver_${id}`;

    await prisma.driver.delete({
      where: { id },
    });

    // 2. Redis cache'dan o‘chirish (agar bo‘lsa)
    await redisClient.del(cacheKey);

    return;
  } catch (error) {
    throw error;
  }
};

const getDriverProfile = async (id) => {
  try {
    // 2. Agar cache'da bo‘lmasa, bazadan olish
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        region: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
          },
        },
        structure: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
          },
        },
        machine: {
          select: {
            id: true,
            name: true,
            nameUz: true,
            nameRu: true,
          },
        },
        balance: {
          select: {
            balance: true,
          },
        },
      },
    });

    return driver;
  } catch (error) {
    throw error;
  }
};

const getDriversByStructureIdForNotification = async (
  structureId,
  machineId,
  legal
) => {
  try {
    return await prisma.driver.findMany({
      where: {
        structureId,
        machineId,
        isOnline: true,
        inWork: false,
        ...(legal && { legal: true }), // faqat legal true bo‘lsa qo‘shiladi
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        lat: true,
        long: true,
        fcmToken: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  findAll,
  getById,
  create,
  updateById,
  deleteById,
  getDriverProfile,
  getDriversByStructureIdForNotification,
};
