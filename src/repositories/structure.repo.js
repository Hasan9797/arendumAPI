import prisma from '../config/prisma.js';
import { getStructureStatusText } from '../enums/structure/structure-status.enum.js';

export const getAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const currentPage = page ? parseInt(page, 10) : 1;
  const pageSize = limit ? parseInt(limit, 10) : 10;
  const skip = (currentPage - 1) * pageSize;

  try {
    const where = {};

    if (Array.isArray(filters) && filters.length > 0) {
      filters.forEach((filter) => {
        const { column, operator, value } = filter;

        if (operator === 'between' && column === 'createdAt') {
          const [startDate, endDate] = value.split('_');

          where[column] = {
            gte: new Date(startDate),
            lte: new Date(endDate),
          };
        } else if (operator === 'contains') {
          where[column] = { contains: value, mode: 'insensitive' };
        } else if (operator === 'equals') {
          where[column] = value;
        }
      });
    }

    const orderBy = sort?.column
      ? { [sort.column]: sort.value }
      : { id: 'desc' };

    const structures = await prisma.structure.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: { region: true },
    });

    const total = await prisma.structure.count({ where });

    const regionNameKey = lang === 'uz' ? 'nameUz' : 'nameRu';

    const data = structures.map(
      ({ nameRu, nameUz, nameEn, regionId, region, ...rest }) => ({
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
        region: region[regionNameKey],
        status: getStructureStatusText(rest.status),
      })
    );

    return {
      data,
      pagination: {
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage,
        pageSize,
      },
    };
  } catch (error) {
    console.error('Error fetching structures:', error);
    throw new Error('An error occurred while fetching structures.');
  }
};

const getById = async (id) => {
  return await prisma.structure.findUnique({
    where: { id },
  });
};

const create = async (newUser) => {
  return await prisma.structure.create({
    data: newUser,
  });
};

const updateById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.structure.update({
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
    return await prisma.structure.delete({
      where: { id },
    });
  } catch (error) {
    throw error.message;
  }
};

const getIds = async () => {
  try {
    return await prisma.structure.findMany({
      select: { id: true, name: true },
    });
  } catch (error) {
    throw error.message;
  }
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getIds,
};
