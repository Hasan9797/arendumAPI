import prisma from '../config/prisma.js';

export const getAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (page - 1) * limit;

  try {
    const where = {};

    filters.forEach((filter) => {
      const { column, operator, value } = filter;

      if (operator === 'between' && column === 'createdAt') {
        const [startDate, endDate] = value.split('_');

        const startUnixTimestamp = Math.floor(Date.parse(startDate) / 1000);
        const endUnixTimestamp = Math.floor(Date.parse(endDate) / 1000);

        where[column] = {
          gte: startUnixTimestamp,
          lte: endUnixTimestamp,
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

    const regions = await prisma.region.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        structures: {
          select: {
            id: true,
            name: true,
            nameRu: true,
            nameUz: true,
            status: true,
          },
        },
      },
    });

    const total = await prisma.region.count({ where });

    const data = regions.map((driver) => {
      const { nameRu, nameUz, nameEn, structures, ...rest } = driver;

      const adjustName = (obj) => {
        const { nameRu, nameUz, ...relationRest } = obj;
        return {
          ...relationRest,
          name: lang === 'ru' ? nameRu : nameUz,
        };
      };

      return {
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
        // status: { key: rest.status, value: getRegionStatusText(rest.status) },
        structure: structures
          ? structures.map((structure) => adjustName(structure))
          : [],
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

const getById = async (lang, id) => {
  const region = await prisma.region.findUnique({
    where: { id },
    include: {
      structures: {
        select: {
          id: true,
          name: true,
          nameRu: true,
          nameUz: true,
          nameEn: true,
          status: true,
        },
      },
    },
  });

  const adjustName = (obj) => {
    if (!obj) return {};

    const { nameRu, nameUz, nameEn, ...res } = obj;
    return {
      ...res,
      name: lang === 'ru' ? nameRu : nameUz,
    };
  };

  let serialazied = region ? adjustName(region) : {};
  serialazied.structures = serialazied.structures.map((structure) =>
    adjustName(structure)
  );

  return serialazied;
};

const createRegion = async (newUser) => {
  return await prisma.region.create({
    data: newUser,
  });
};

const updateById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.region.update({
      where: { id },
      data: machineData,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.region.delete({
      where: { id },
    });
  } catch (error) {
    throw error.message;
  }
};

const getIds = async () => {
  try {
    return await prisma.region.findMany({
      select: { id: true, name: true },
    });
  } catch (error) {
    throw error.message;
  }
};

export default {
  getAll,
  getById,
  createRegion,
  updateById,
  deleteById,
  getIds,
};
