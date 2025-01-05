import prisma from '../config/prisma.js';

export const findAll = async (query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

      if (operator === 'between' && column === 'created_at') {
        const [startDate, endDate] = value.split('_');
        where[column] = {
          gte: startDate,
          lte: endDate,
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
            status: true,
          },
        },
        structure: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        machine: {
          select: {
            id: true,
            title: true,
            img: true,
          },
        },
      },
    });

    const total = await prisma.driver.count({ where });

    const sanitizedDrivers = drivers.map(
      ({ regionId, structureId, machineId, ...rest }) => rest
    );

    return {
      data: sanitizedDrivers,
      pagination: {
        totalUsers: total,
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
  return await prisma.driver.delete({
    where: { id },
  });
};

const getDriversByStructureIdForNotification = async (structureId) => {
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
