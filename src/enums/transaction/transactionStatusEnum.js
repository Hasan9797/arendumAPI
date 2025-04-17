const STATUS_CREATED = 1;
const STATUS_PENDING = 2;
const STATUS_ERROR = 3;
const STATUS_SUCCESS = 4;
const STATUS_CANCELLED = 5;

const statusTranslations = {
  1: 'Создан',
  2: 'В обработке',
  3: 'Ошибка',
  4: 'Оплачен',
  5: 'Отменен',
};

const transactionStatusOptions = [
  {
    value: STATUS_CREATED,
    label: statusTranslations[STATUS_CREATED],
  },
  {
    value: STATUS_PENDING,
    label: statusTranslations[STATUS_PENDING],
  },
  {
    value: STATUS_ERROR,
    label: statusTranslations[STATUS_ERROR],
  },
  {
    value: STATUS_SUCCESS,
    label: statusTranslations[STATUS_SUCCESS],
  },
  {
    value: STATUS_CANCELLED,
    label: statusTranslations[STATUS_CANCELLED],
  },
];

const getStatusName = (status) => {
  return statusTranslations[status] || 'Неизвестный';
};

export default {
  STATUS_CREATED,
  STATUS_PENDING,
  STATUS_ERROR,
  STATUS_SUCCESS,
  STATUS_CANCELLED,
  transactionStatusOptions,
  getStatusName,
};
