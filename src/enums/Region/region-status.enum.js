// Status enum
export const regionStatus = Object.freeze({
  INACTIVE: 1,
  ACTIVE: 2,
});

const StatusTranslations = {
  1: 'Неактивный',
  2: 'Активный',
};

export const regionStatusOptions = [
  {
    value: regionStatus.ACTIVE,
    label: StatusTranslations[regionStatus.ACTIVE],
  },
  {
    value: regionStatus.INACTIVE,
    label: StatusTranslations[regionStatus.INACTIVE],
  },
];

export const getRegionStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
