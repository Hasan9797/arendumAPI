import prisma from '../config/prisma.js';
import { regionStatus } from '../enums/Region/regionStatusEnum.js';
import { structureStatus } from '../enums/structure/structureStatusEnum.js';
import { buildWhereFilter } from '../helpers/whereFilterHelper.js';
import redisClient from '../config/redis.js';

const getAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value };

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
      const {
        nameRu,
        nameUz,
        nameEn,
        structures,
        createdAt,
        updatedAt,
        ...rest
      } = driver;

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
        createdAt,
        updatedAt,
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
    throw error;
  }
};

const getById = async (lang, id) => {
  try {
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
        nameRu,
        nameUz,
        nameEn,
      };
    };

    let serialazied = region ? adjustName(region) : {};
    serialazied.structures = serialazied.structures.map((structure) =>
      adjustName(structure)
    );

    return serialazied;
  } catch (error) {
    throw error;
  }
};

const createRegion = async (newUser) => {
  try {
    return await prisma.region.create({
      data: newUser,
    });
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, machineData) => {
  try {
    await redisClient.del(`region:${id}`);

    return await prisma.region.update({
      where: { id },
      data: machineData,
    });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    await redisClient.del(`region:${id}`);
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

const getRegionStatic = async (lang) => {
  try {
    const regions = await prisma.region.findMany({
      where: { status: regionStatus.ACTIVE },
      select: {
        id: true,
        name: true,
        nameRu: true,
        nameUz: true,
        structures: {
          where: { status: structureStatus.ACTIVE },
          select: {
            id: true,
            name: true,
            nameRu: true,
            nameUz: true,
          },
        },
      },
    });

    const adjustName = (obj) => {
      const { nameRu, nameUz, ...relationRest } = obj;
      return {
        ...relationRest,
        name: lang === 'ru' ? nameRu : nameUz,
      };
    };

    const data = regions.map((region) => {
      const { nameRu, nameUz, structures, createdAt, updatedAt, ...rest } =
        region;

      return {
        ...rest,
        name: lang === 'ru' ? nameRu : nameUz,
        structure: structures
          ? structures.map((structure) => adjustName(structure))
          : [],
        createdAt,
        updatedAt,
      };
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  const cacheKey = `region:${id}`;
  try {
    const cachedRegion = await redisClient.get(cacheKey);

    if (cachedRegion) {
      return JSON.parse(cachedRegion);
    }

    const region = await prisma.region.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        nameRu: true,
        nameUz: true,
        isOpen: true,
      },
    });

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(region)); // 3600 sekund = 1 soat

    return region;
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  createRegion,
  updateById,
  deleteById,
  getIds,
  getRegionStatic,
  getOne,
};
