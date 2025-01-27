import machinePriceRepo from '../repositories/machine-price.repo.js';
import prisma from '../config/prisma.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getPrices = async (lang, query) => {
  try {
    const result = await machinePriceRepo.getMachinesPrice(lang, query);
    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const getPriceById = async (lang, id) => {
  return await machinePriceRepo.getMachinePriceById(lang, id);
};

const getPriceByMachineId = async (id) => {
  try {
    const result = await machinePriceRepo.getPriceByMachineId(id);
    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const createPrice = async (data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const { additionalParameters, ...rest } = data;

      const machinePrice = await tx.machinePrice.create({
        data: rest,
      });

      const paramsPromises = additionalParameters.map((param) =>
        tx.machinePriceParams.create({
          data: {
            parameter: param.parameter,
            parameterName: param.parameterName,
            unit: param.unit,
            type: param.type,
            machinePriceId: machinePrice.id,
          },
        })
      );

      await Promise.all(paramsPromises);

      return true;
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect(); // Ulanishni yopish
  }
};

const updatePrice = async (id, data) => {
  return await machinePriceRepo.updateMachinePriceById(id, data);
};

const deletePrice = async (id) => {
  return await machinePriceRepo.deleteMachinePriceById(id);
};

export default {
  getPrices,
  getPriceById,
  createPrice,
  updatePrice,
  deletePrice,
  getPriceByMachineId,
};
