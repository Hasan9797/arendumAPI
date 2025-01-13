// Status enum
export const ClientStatus = Object.freeze({
  CREATED: 0,
  INACTIVE: 1,
  ACTIVE: 2,
});

const StatusTranslations = {
  0: 'Создан',
  1: 'Неактивный',
  2: 'Активный',
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

export const getClientStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
