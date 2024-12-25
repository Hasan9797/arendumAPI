import userRepository from '../repositories/user.repo.js';
import bcrypt from 'bcryptjs';

const getUsers = async (query) => {
  return await userRepository.getUsers(query);
};

const getUserById = async (id) => {
  return await userRepository.getUser(id);
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
