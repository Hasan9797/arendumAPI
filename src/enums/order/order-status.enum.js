// Status enum
export const OrderStatus = Object.freeze({
  NEW: 1,
  SEARCHING: 2,
  ASSIGNED: 3,
  IN_PROGRESS: 4,
  ARRIVED: 5,
  COMPLETED: 6,
  CANCELLED: 7,
  FAILED: 8,
});

const StatusTranslations = {
  1: 'Новый заказ',
  2: 'Поиск водителя',
  3: 'Водитель назначен',
  4: 'В пути',
  5: 'Водитель прибыл',
  6: 'Завершено',
  7: 'Отменено',
  8: 'Ошибка',
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
    value: OrderStatus.IN_PROGRESS,
    label: StatusTranslations[OrderStatus.IN_PROGRESS],
  },
  {
    value: OrderStatus.COMPLETED,
    label: StatusTranslations[OrderStatus.COMPLETED],
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
