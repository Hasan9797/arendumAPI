import prisma from '../config/prisma.js';

export const findAll = async (lang, query) => {
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

    const clients = await prisma.client.findMany({
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
      },
    });

    const total = await prisma.client.count({ where });

    const sanitizedDrivers = clients.map(
      ({ regionId, structureId, machineId, ...rest }) => rest
    );

    const data = sanitizedDrivers.map((driver) => {
      const { region, structure, machine, ...rest } = driver;

      // Adjust name field based on the language
      const adjustName = (obj) => {
        const { nameRu, nameUz, ...rest } = obj;
        return {
          ...rest,
          name: lang === 'ru' ? nameRu : nameUz,
        };
      };

      return {
        ...rest,
        region: region ? adjustName(region) : null,
        structure: structure ? adjustName(structure) : null,
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

const createClient = async (newClient) => {
  return await prisma.client.create({
    data: newClient,
  });
};

const getById = async (id) => {
  return await prisma.client.findUnique({
    where: { id },
  });
};

const deleteClientById = async (id) => {
  return await prisma.client.delete({
    where: { id },
  });
};

const updateClientById = async (id, userData) => {
  try {
    const updatedUser = await prisma.client.update({
      where: { id },
      data: userData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export default {
  findAll,
  getById,
  createClient,
  updateClientById,
  deleteClientById,
};
