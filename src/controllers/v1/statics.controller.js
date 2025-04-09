import { driverStatusOptions } from '../../enums/driver/driverStatusEnum.js';
import { clientStatusOptions } from '../../enums/client/clientStatusEnum.js';
import { StatusOptions } from '../../enums/order/orderStatusEnum.js';
import { amountTypeOptions } from '../../enums/pay/paymentTypeEnum.js';

import regionRepository from '../../repositories/region.repo.js';
import structureRepository from '../../repositories/structure.repo.js';

const driverStatus = (req, res) => {
  try {
    res.status(200).json({ success: true, data: driverStatusOptions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options',
    });
  }
};

const getRegionIds = async (req, res) => {
  try {
    const regionIds = await regionRepository.getIds();
    res.status(200).json({ success: true, data: regionIds });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.getMessage(),
    });
  }
};

const getStructureIds = async (req, res) => {
  try {
    const structureIds = await structureRepository.getIds();
    res.status(200).json({ success: true, data: structureIds });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.getMessage(),
    });
  }
};

const clientStatus = (req, res) => {
  res.status(200).json({ success: true, data: clientStatusOptions });
};

const machineStatus = (req, res) => {};

const orderStatus = (req, res) => {
  res.status(200).json({ success: true, data: StatusOptions });
};

const orderAmountType = (req, res) => {
  res.status(200).json({ success: true, data: amountTypeOptions });
};

const userOptions = (req, res) => {};

const machineManufacturers = (req, res) => {};

const machineModels = (req, res) => {};

const machineManufactureYears = (req, res) => {};

export default {
  driverStatus,
  getRegionIds,
  getStructureIds,
  clientStatus,
  machineStatus,
  orderStatus,
  orderAmountType,
  userOptions,
  machineManufacturers,
  machineModels,
  machineManufactureYears,
};
