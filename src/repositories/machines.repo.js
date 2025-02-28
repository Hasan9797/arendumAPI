import prisma from '../config/prisma.js';
import { buildWhereFilter } from '../helpers/where-filter-helper.js';

const getMachines = async (lang, query) => {
  const { page, limit, sort, filters } = query;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

  try {
    const where = buildWhereFilter(filters, lang);

    const orderBy = { [sort.column]: sort.value };

    const machines = await prisma.machines.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        MachinePrice: {
          include: {
            machinePriceParams: true,
          },
        },
      },
    });

    const total = await prisma.machines.count({ where });

    const formattedMachines = machines.map((machine) => ({
      ...machine,
      MachinePrice:
        machine.MachinePrice.length > 0 ? machine.MachinePrice[0] : null, // Birinchi elementni olish
    }));

    const data = formattedMachines.map((machine) => {
      const { nameRu, nameUz, nameEn, ...rest } = machine;
      rest.name = lang == 'uz' ? nameUz : nameRu;
      return rest;
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

const createMachine = async (newUser) => {
  try {
    return await prisma.machines.create({
      data: newUser,
    });
  } catch (error) {
    throw error;
  }
};

const getMachineById = async (lang, id) => {
  const machine = await prisma.machines.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      nameRu: true,
      nameUz: true,
      nameEn: true,
      img: true,
      MachinePrice: {
        select: {
          id: true,
          minAmount: true,
          minimum: true,
          machinePriceParams: {
            select: {
              id: true,
              parameter: true,
              parameterName: true,
              unit: true,
              type: true,
            },
          },
        },
      },
    },
  });


  const adjustName = (obj) => {
    const { nameRu, nameUz, nameEn, ...rest } = obj;
    return {
      ...rest,
      name: lang === 'ru' ? nameRu : nameUz,
    };
  };

  return adjustName(machine);
};

const deleteMachineById = async (id) => {
  try {
    return await prisma.machines.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

const updateMachineById = async (id, machineData) => {
  try {
    const updatedUser = await prisma.machines.update({
      where: { id },
      data: machineData,
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const getMachinesIdAnName = async () => {
  return await prisma.machines.findMany({
    select: {
      id: true,
      title: true,
    },
  });
};

const getOne = async (id) => {
  try {
    return await prisma.machines.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachineById,
  deleteMachineById,
  getMachinesIdAnName,
  getOne,
};
