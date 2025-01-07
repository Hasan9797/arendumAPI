// Status enum
export const DriverStatus = Object.freeze({
  INACTIVE: 0,
  ACTIVE: 1,
  CREATED: 2,
});

const StatusTranslations = {
  1: 'Активный',
  2: 'Создан',
  0: 'Неактивный',
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

export const getStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
