import prisma from '../config/prisma.js';
import { getDriverStatusText } from '../enums/driver/driver-status.enum.js';

export const findAll = async (lang, query) => {
  const { page = 1, limit = 10, sort, filters = [] } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10); // Default page = 1, limit = 10

  try {
    let where = {};

    filters.forEach((filter) => {
      let { column, operator, value } = filter;

      if (!column || !operator || value === undefined) return; // Agar noto‘g‘ri filter bo‘lsa, uni o‘tkazib yuboramiz

      // Tilga qarab `nameUz` yoki `nameRu` ustunini dinamik tanlash
      if (column === 'name' && (lang === 'uz' || lang === 'ru')) {
        column = `name${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
      }

      // Agar ustun `status` bo‘lsa va u `Int` bo‘lishi kerak bo‘lsa, `parseInt()` qilish
      if (column === 'status') {
        value = parseInt(value, 10);
      }

      // Agar ustun `createdAt` va `between` operatori bo‘lsa, `Date` obyektiga o‘tkazish
      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

        where[column] = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      } else {
        // Operatorga qarab filterni o‘rnatish
        if (operator === 'contains') {
          where[column] = { contains: value, mode: 'insensitive' };
        } else if (operator === 'equals') {
          where[column] = { equals: value };
        } else if (operator === 'gt') {
          where[column] = { gt: value };
        } else if (operator === 'lt') {
          where[column] = { lt: value };
        }
      }
    });

    // Default `orderBy` agar `sort` mavjud bo‘lsa
    const orderBy = sort?.column
      ? { [sort.column]: sort.value === 'asc' ? 'asc' : 'desc' }
      : { id: 'desc' };

    // Prisma so‘rov
    const drivers = await prisma.driver.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit, 10),
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
      };
    });

    // Natijani qaytarish
    return {
      data,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
      },
    };
  } catch (error) {
    console.error('Error in findAll:', error);
    throw error;
  }
};

const create = async (newDriver) => {
  try {
    return await prisma.driver.create({
      data: newDriver,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const getById = async (id) => {
  return await prisma.driver.findUnique({
    where: { id },
  });
};

const updateById = async (id, driverData) => {
  try {
    const updatedUser = await prisma.driver.update({
      where: { id },
      data: driverData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.driver.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

const getDriversByStructureIdForNotification = async (
  structureId,
  orderParams
) => {
  return await prisma.driver.findMany({
    where: { structureId },
    select: {
      id: true,
      lat: true,
      long: true,
      fcmToken: true,
    },
  });
};

export default {
  findAll,
  getById,
  create,
  updateById,
  deleteById,
  getDriversByStructureIdForNotification,
};
