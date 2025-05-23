import userRepository from '../repositories/user.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import bcrypt from 'bcryptjs';
import { deleteUserTokenByUserId } from '../repositories/userToken.repo.js';

const getUsers = async (query) => {
  try {
    const users = await userRepository.getUsers(query);
    return {
      data: formatResponseDates(users.data),
      pagination: users.pagination,
    };
  } catch (error) {
    throw error;
  }
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

const deleteUser = async (userId) => {
  await deleteUserTokenByUserId(userId);
  return await userRepository.deleteUserById(userId);
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
