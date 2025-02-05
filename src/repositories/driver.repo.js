import prisma from '../config/prisma.js';
import { getDriverStatusText } from '../enums/driver/driver-status.enum.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

export const findAll = async (lang, query) => {
  const { page, limit, sort, filters = [] } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = sort?.column
      ? { [sort.column]: sort.value === 'asc' ? 'asc' : 'desc' }
      : { id: 'desc' };

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
        currentPage: page,
        pageSize: limit,
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
