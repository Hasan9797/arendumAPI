import prisma from '../config/prisma.js';
import { getClientStatusText } from '../enums/client/client-status.enum.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

const findAll = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value }

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
        // cards: {
        //   select: {
        //     id: true,
        //     cardId: true,
        //     pan: true,
        //     expiry: true,
        //     cardHolder: true,
        //     balance: true,
        //     phone: true,
        //     cardToken: true,
        //     status: true,
        //   },
        // },
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
        const { nameRu, nameUz, status, ...relationRest } = obj;
        return {
          ...relationRest,
          name: lang === 'ru' ? nameRu : nameUz,
        };
      };

      return {
        ...rest,
        status: { key: rest.status, value: getClientStatusText(rest.status) },
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

const getById = async (lang, id) => {
  try {
    const client = await prisma.client.findUnique({
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
        // cards: {
        //   select: {
        //     id: true,
        //     cardId: true,
        //     pan: true,
        //     expiry: true,
        //     cardHolder: true,
        //     balance: true,
        //     phone: true,
        //     cardToken: true,
        //     status: true,
        //   },
        // },
      },
    });

    const adjustName = (obj) => {
      return {
        ...obj,
        name: lang === 'ru' ? obj.nameRu : obj.nameUz,
      };
    };

    if (client) {
      const { createdAt, updatedAt, regionId, structureId, ...rest } = client;

      return {
        ...rest,
        region: rest.region ? adjustName(rest.region) : null,
        structure: rest.structure ? adjustName(rest.structure) : null,
        status: { key: rest.status, value: getClientStatusText(rest.status) },
        createdAt,
        updatedAt,
      };
    }

    return client;
  } catch (error) {
    throw error;
  }
};

const getClientStructureId = async (clientId) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { structureId: true },
  });

  return client.structureId;
};

const createClient = async (newClient) => {
  return await prisma.client.create({
    data: newClient,
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

const deleteClientById = async (id) => {
  return await prisma.client.delete({
    where: { id },
  });
};

export default {
  findAll,
  getById,
  createClient,
  updateClientById,
  deleteClientById,
  getClientStructureId,
};
