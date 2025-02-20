export const PAYMENT_TYPE = Object.freeze({
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
      value: PAYMENT_TYPE.CASH,
      label: TypeTranslations[PAYMENT_TYPE.CASH],
      percent: 0,
    },
    {
      value: PAYMENT_TYPE.CARD,
      label: TypeTranslations[PAYMENT_TYPE.CARD],
      percent: 0,
    },
    {
      value: PAYMENT_TYPE.ACCOUNT,
      label: TypeTranslations[PAYMENT_TYPE.ACCOUNT],
      percent: 12,
    },
  ];
  
  export const getAmountTypeText = (type) => {
    return TypeTranslations[type] || 'Неизвестный';
  };