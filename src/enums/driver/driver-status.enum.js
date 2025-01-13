// Status enum
export const DriverStatus = Object.freeze({
  CREATED: 0,
  INACTIVE: 1,
  ACTIVE: 2,
});

const StatusTranslations = {
  0: 'Созданный',
  1: 'Неактивный',
  2: 'Активный',
};

export const driverStatusOptions = [
  {
    value: DriverStatus.ACTIVE,
    label: StatusTranslations[DriverStatus.ACTIVE],
  },
  {
    value: DriverStatus.CREATED,
    label: StatusTranslations[DriverStatus.CREATED],
  },
  {
    value: DriverStatus.INACTIVE,
    label: StatusTranslations[DriverStatus.INACTIVE],
  },
];

export const getDriverStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
