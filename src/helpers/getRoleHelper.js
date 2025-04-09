import Roles, { ROLE_NAME } from '../enums/user/userRoleEnum.js';

export function getRoleNameByNumber(roleNumber) {
  return ROLE_NAME[roleNumber] || 'Unknown Role';
}

export function getRoleNumberByName(roleName) {
  const entry = Object.entries(ROLE_NAME).find(
    ([, name]) => name.toLowerCase() === roleName.toLowerCase()
  );
  return entry ? parseInt(entry[0], 10) : null;
}

export function isValidRole(roleNumber) {
  return Object.values(Roles).includes(roleNumber);
}
