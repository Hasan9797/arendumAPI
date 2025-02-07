// Status enum
export const ORDER_TYPE = Object.freeze({
  KM: 1,
  HOUR: 2,
});

const TypeTranslations = {
  1: 'Километраж',
  2: 'Часы',
};

export const StatusOptions = [
  { value: ORDER_TYPE.KM, label: TypeTranslations[ORDER_TYPE.KM] },
  { value: ORDER_TYPE.HOUR, label: TypeTranslations[ORDER_TYPE.HOUR] },
];

export const getTypeText = (type) => {
  return TypeTranslations[type] || 'Неизвестный';
};
