const ADMIN = 1;
const SUPER_ADMIN = 2;
const ACCOUNTANT = 3;
const CLIENT = 4;
const DRIVER = 5;
const MERCHANT = 6;
const MODERATOR = 7;
const OPERATOR = 8;
const FINANCE = 9;

export const ROLE_NAME = {
  [ADMIN]: 'Admin',
  [SUPER_ADMIN]: 'Super Admin',
  [ACCOUNTANT]: 'Accountant',
  [CLIENT]: 'Client',
  [DRIVER]: 'Driver',
  [MERCHANT]: 'Merchant',
  [MODERATOR]: 'Moderator',
  [OPERATOR]: 'Operator',
  [FINANCE]: 'Finance',
};

export const userRoleOptions = [
  {
    value: ADMIN,
    label: ROLE_NAME[ADMIN],
  },
  {
    value: SUPER_ADMIN,
    label: ROLE_NAME[SUPER_ADMIN],
  },
  {
    value: ACCOUNTANT,
    label: ROLE_NAME[ACCOUNTANT],
  },
  {
    value: CLIENT,
    label: ROLE_NAME[CLIENT],
  },
  {
    value: DRIVER,
    label: ROLE_NAME[DRIVER],
  },
  {
    value: MERCHANT,
    label: ROLE_NAME[MERCHANT],
  },
  {
    value: MODERATOR,
    label: ROLE_NAME[MODERATOR],
  },
  {
    value: OPERATOR,
    label: ROLE_NAME[OPERATOR],
  },
  {
    value: FINANCE,
    label: ROLE_NAME[FINANCE],
  }

];

export default {
  ADMIN,
  ACCOUNTANT,
  MERCHANT,
  CLIENT,
  DRIVER,
  SUPER_ADMIN,
  MODERATOR,
  OPERATOR,
  FINANCE,
};
