// Status enum
export const OrderStatus = Object.freeze({
  NEW: 1,
  SEARCHING: 2,
  ASSIGNED: 3,
  ARRIVED: 4,
  START_WORK: 5,
  PAUSE_WORK: 6,
  COMPLETED: 7,
  CLIENT_ACCEPT: 8,
  PLANNED: 10,
  CANCELLED: 9,
  FAILED: 0,
});

const StatusTranslations = {
  1: 'Новый заказ',
  2: 'Поиск водителя',
  3: 'Водитель назначен',
  4: 'Водитель на месте',
  5: 'Начало',
  6: 'Пауза',
  7: 'Завершено',
  8: 'Клиент подтверждено',
  9: 'Отменено',
  10: 'Планируется',
  0: 'Ошибка',
};

export const StatusOptions = [
  { value: OrderStatus.NEW, label: StatusTranslations[OrderStatus.NEW] },
  {
    value: OrderStatus.SEARCHING,
    label: StatusTranslations[OrderStatus.SEARCHING],
  },
  {
    value: OrderStatus.ASSIGNED,
    label: StatusTranslations[OrderStatus.ASSIGNED],
  },
  {
    value: OrderStatus.ARRIVED,
    label: StatusTranslations[OrderStatus.ARRIVED],
  },
  {
    value: OrderStatus.START_WORK,
    label: StatusTranslations[OrderStatus.START_WORK],
  },
  {
    value: OrderStatus.COMPLETED,
    label: StatusTranslations[OrderStatus.COMPLETED],
  },
  {
    value: OrderStatus.CLIENT_ACCEPT,
    label: StatusTranslations[OrderStatus.CLIENT_ACCEPT],
  },
  {
    value: OrderStatus.CANCELLED,
    label: StatusTranslations[OrderStatus.CANCELLED],
  },
  { value: OrderStatus.FAILED, label: StatusTranslations[OrderStatus.FAILED] },
];

export const getStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
