// Status enum
export const OrderStatus = Object.freeze({
  NEW: 1,
  SEARCHING: 2,
  ASSIGNED: 3,
  DRIVER_ON_WAY: 4, // ✅ Yangi status
  ARRIVED: 5,
  START_WORK: 6,
  PAUSE_WORK: 7,
  COMPLETED: 8,
  CLIENT_ACCEPT: 9,
  CANCELLED: 11,
  FAILED: 0,
});

// Status matnli tarjimalari
const StatusTranslations = {
  1: 'Новый заказ',
  2: 'Поиск водителя',
  3: 'Водитель назначен',
  4: 'Водитель в пути', // ✅ Yangi status
  5: 'Водитель на месте',
  6: 'Начало',
  7: 'Пауза',
  8: 'Завершено',
  9: 'Клиент подтверждено',
  10: 'Отменено',
  0: 'Ошибка',
};

// Status variantlari (UI uchun)
export const StatusOptions = [
  { value: OrderStatus.NEW, label: StatusTranslations[OrderStatus.NEW] },
  { value: OrderStatus.SEARCHING, label: StatusTranslations[OrderStatus.SEARCHING] },
  { value: OrderStatus.ASSIGNED, label: StatusTranslations[OrderStatus.ASSIGNED] },
  { value: OrderStatus.DRIVER_ON_WAY, label: StatusTranslations[OrderStatus.DRIVER_ON_WAY] }, // ✅ Yangi
  { value: OrderStatus.ARRIVED, label: StatusTranslations[OrderStatus.ARRIVED] },
  { value: OrderStatus.START_WORK, label: StatusTranslations[OrderStatus.START_WORK] },
  { value: OrderStatus.COMPLETED, label: StatusTranslations[OrderStatus.COMPLETED] },
  { value: OrderStatus.CLIENT_ACCEPT, label: StatusTranslations[OrderStatus.CLIENT_ACCEPT] },
  { value: OrderStatus.CANCELLED, label: StatusTranslations[OrderStatus.CANCELLED] },
  { value: OrderStatus.FAILED, label: StatusTranslations[OrderStatus.FAILED] },
];

// Status nomini olish
export const getStatusText = (statusId) => {
  return StatusTranslations[statusId] || 'Неизвестный';
};
