import prisma from '../config/prisma.js';
import { getStructureStatusText } from '../enums/structure/structure-status.enum.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

export const getAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = sort?.column
      ? { [sort.column]: sort.value }
      : { id: 'desc' };

    const structures = await prisma.structure.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { region: true },
    });

    const total = await prisma.structure.count({ where });

    const regionNameKey = lang === 'uz' ? 'nameUz' : 'nameRu';

    const data = structures.map(
      ({ nameRu, nameUz, nameEn, regionId, region, ...rest }) => ({
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
        region: region[regionNameKey],
      })
    );

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
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await prisma.structure.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

const getIds = async () => {
  try {
    return await prisma.structure.findMany({
      select: { id: true, name: true },
    });
  } catch (error) {
    throw error;
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
