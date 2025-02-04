import userRepository from '../repositories/user.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import bcrypt from 'bcryptjs';

const getUsers = async (query) => {
  const users = await userRepository.getUsers(query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getUserById = async (userId) => {
  try {
    if (!userId) throw new Error('User id is required');

    const user = await userRepository.getUser(userId);
    const { password, ...rest } = user;
    return formatResponseDates(rest);
  } catch (error) {
    throw error;
  }
};

const createUser = async (data) => {
  try {
    const passwordHash = bcrypt.hashSync(data.password, 10);

    const newUser = { ...data, password: passwordHash };
    return await userRepository.createUser(newUser);
  } catch (error) {
    throw error;
  }
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
