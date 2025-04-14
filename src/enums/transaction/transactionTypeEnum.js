const DEPOSIT_REPLINSHMENT = 1;
const DEPOSIT_WITHDRAW = 2;
const PAYMENT_ORDER = 3;

const TypeTranslations = {
  1: 'Пополнение баланса',
  2: 'Вывод средств',
  3: 'Оплата заказа',
};

const transactionTypeOptions = [
  {
    value: DEPOSIT_REPLINSHMENT,
    label: TypeTranslations[DEPOSIT_REPLINSHMENT],
  },
  {
    value: DEPOSIT_WITHDRAW,
    label: TypeTranslations[DEPOSIT_WITHDRAW],
  },
  {
    value: PAYMENT_ORDER,
    label: TypeTranslations[PAYMENT_ORDER],
  },
];

const getTypeName = (type) => {
  return TypeTranslations[type] || 'Неизвестный';
};

export default {
  DEPOSIT_REPLINSHMENT,
  DEPOSIT_WITHDRAW,
  PAYMENT_ORDER,
  transactionTypeOptions,
  getTypeName,
};
