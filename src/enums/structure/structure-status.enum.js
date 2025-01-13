// Status enum
export const structureStatus = Object.freeze({
  INACTIVE: 1,
  ACTIVE: 2,
});

const StatusTranslations = {
  1: 'Неактивный',
  2: 'Активный',
};

export const structureStatusOptions = [
  {
    value: structureStatus.ACTIVE,
    label: StatusTranslations[structureStatus.ACTIVE],
  },
  {
    value: structureStatus.CREATED,
    label: StatusTranslations[structureStatus.CREATED],
  },
  {
    value: structureStatus.INACTIVE,
    label: StatusTranslations[structureStatus.INACTIVE],
  },
];

export const getStructureStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
