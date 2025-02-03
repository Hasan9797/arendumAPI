import prisma from '../config/prisma.js';
import { getDriverStatusText } from '../enums/driver/driver-status.enum.js';

export const findAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    let where = {};

    filters.forEach((filter) => {
      let { column, operator, value } = filter;

      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

        where[column] = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      } else {
        if (operator === 'contains') {
          where[column] = { contains: value, mode: 'insensitive' };
        } else if (operator === 'equals') {
          where[column] = value;
        }
      }
    });

    const orderBy = sort?.column
      ? { [sort.column]: sort.value }
      : { id: 'desc' };

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

    const sanitizedDrivers = drivers.map(
      ({ regionId, structureId, machineId, ...rest }) => rest
    );

    const data = sanitizedDrivers.map((driver) => {
      const { region, structure, machine, ...rest } = driver;

      // Adjust name field based on the language
      const adjustName = (obj) => {
        const { nameRu, nameUz, status, ...relationRest } = obj;
        return {
          ...relationRest,
          name: lang === 'ru' ? nameRu : nameUz,
        };
      };

      return {
        ...rest,
        status: { key: rest.status, value: getDriverStatusText(rest.status) },
        region: region ? adjustName(region) : null,
        structure: structure ? adjustName(structure) : null,
        machine: machine ? adjustName(machine) : null,
      };
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
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
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
