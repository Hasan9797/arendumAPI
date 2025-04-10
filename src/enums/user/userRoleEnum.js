const ADMIN = 1;
const ACCOUNTANT = 2;
const MERCHANT = 3;
const CLIENT = 4;
const DRIVER = 5;

export const ROLE_NAME = {
  [ADMIN]: 'Admin',
  [ACCOUNTANT]: 'Accountant',
  [MERCHANT]: 'Merchant',
};

export const userRoleOptions = [
  {
    value: ADMIN,
    label: ROLE_NAME[ADMIN],
  },
  {
    value: ACCOUNTANT,
    label: ROLE_NAME[ACCOUNTANT],
  },
  {
    value: MERCHANT,
    label: ROLE_NAME[MERCHANT],
  },
  {
    value: CLIENT,
    label: 'Client',
  },
  {
    value: DRIVER,
    label: 'Driver',
  },
];

export default {
  ADMIN,
  ACCOUNTANT,
  MERCHANT,
  CLIENT,
  DRIVER,
};
