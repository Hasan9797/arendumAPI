// Status enum
export const userStatus = Object.freeze({
  CREATED: 0,
  ACTIVE: 2,
  INACTIVE: 1,
});

const StatusTranslations = {
  0: 'Создан',
  1: 'Неактивный',
  2: 'Активный',
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
