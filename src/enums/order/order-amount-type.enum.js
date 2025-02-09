// Status enum
export const ORDER_AMOUNT_TYPE = Object.freeze({
  CASH: 1,
  CARD: 2,
  ACCOUNT: 3,
});

const TypeTranslations = {
  1: 'Наличные',
  2: 'Карта',
  3: 'Счет',
};

export const amountTypeOptions = [
  {
    value: ORDER_AMOUNT_TYPE.CASH,
    label: TypeTranslations[ORDER_AMOUNT_TYPE.CASH],
  },
  {
    value: ORDER_AMOUNT_TYPE.CARD,
    label: TypeTranslations[ORDER_AMOUNT_TYPE.CARD],
  },
  {
    value: ORDER_AMOUNT_TYPE.ACCOUNT,
    label: TypeTranslations[ORDER_AMOUNT_TYPE.ACCOUNT],
  },
];

export const getAmountTypeText = (type) => {
  return TypeTranslations[type] || 'Неизвестный';
};
