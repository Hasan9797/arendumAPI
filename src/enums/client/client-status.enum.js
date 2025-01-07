// Status enum
export const ClientStatus = Object.freeze({
  INACTIVE: 0,
  ACTIVE: 1,
  CREATED: 2,
});

const StatusTranslations = {
  1: 'Активный',
  2: 'Создан',
  0: 'Неактивный',
};

export const clientStatusOptions = [
  {
    value: ClientStatus.ACTIVE,
    label: StatusTranslations[ClientStatus.ACTIVE],
  },
  {
    value: ClientStatus.CREATED,
    label: StatusTranslations[ClientStatus.CREATED],
  },
  {
    value: ClientStatus.INACTIVE,
    label: StatusTranslations[ClientStatus.INACTIVE],
  },
];

export const getStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
