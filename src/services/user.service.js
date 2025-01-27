import userRepository from '../repositories/user.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import bcrypt from 'bcryptjs';

const getUsers = async (query) => {
  const users = await userRepository.getUsers(query);
  return formatResponseDates(users);
};

const getUserById = async (id) => {
  const user = await userRepository.getUser(id);
  return formatResponseDates(user);
};

const createUser = async (data) => {
  const passwordHash = bcrypt.hashSync(data.password, 10);

  const newUser = { ...data, password: passwordHash };
  return await userRepository.createUser(newUser);
};

const updateUser = async (id, data) => {
  return await userRepository.updateUserById(id, data);
};

const deleteUser = async (id) => {
  return await userRepository.deleteUserById(id);
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
