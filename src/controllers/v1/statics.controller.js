import { driverStatusOptions } from '../../enums/driver/driver-status.enum.js';
import { clientStatusOptions } from '../../enums/client/client-status.enum.js';

const driverOptions = (req, res) => {
  try {
    res.status(200).json({ success: true, status: driverStatusOptions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options',
    });
  }
};

const clientOptions = (req, res) => {
  res.status(200).json({ success: true, status: clientStatusOptions });
};

const machineOptions = (req, res) => {};

const orderOptions = (req, res) => {};

const userOptions = (req, res) => {};

const machineManufacturers = (req, res) => {};

const machineModels = (req, res) => {};

const machineManufactureYears = (req, res) => {};

export default {
  driverOptions,
  clientOptions,
  machineOptions,
  orderOptions,
  userOptions,
  machineManufacturers,
  machineModels,
  machineManufactureYears,
};
