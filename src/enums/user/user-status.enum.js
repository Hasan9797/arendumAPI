// Status enum
export const userStatus = Object.freeze({
  INACTIVE: 0,
  ACTIVE: 1,
  CREATED: 2,
});

const StatusTranslations = {
  1: 'Активный',
  2: 'Создан',
  0: 'Неактивный',
};

export const userStatusOptions = [
  {
    value: userStatus.ACTIVE,
    label: StatusTranslations[userStatus.ACTIVE],
  },
  {
    value: userStatus.CREATED,
    label: StatusTranslations[userStatus.CREATED],
  },
  {
    value: userStatus.INACTIVE,
    label: StatusTranslations[userStatus.INACTIVE],
  },
];

export const getStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
