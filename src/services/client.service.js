import clientRepository from '../repositories/client.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import { deleteUserRefreshTokenByUserId } from '../repositories/userToken.repo.js';

const getClients = async (lang, query) => {
  const result = await clientRepository.findAll(lang, query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getById = async (id) => {
  try {
    const client = await clientRepository.getById(id);
    return formatResponseDates(client);
  } catch (error) {
    throw error;
  }
};

const getClientById = async (id, lang) => {
  try {
    if (!id) return null;

    const client = await clientRepository.getByIdRelation(id, lang);
    return formatResponseDates(client);
  } catch (error) {
    throw error;
  }
};

const createClient = async (data) => {
  return await clientRepository.createClient(data);
};

const updateClient = async (id, data) => {
  try {
    return await clientRepository.updateClientById(id, data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const deleteClient = async (clientId) => {
  await deleteUserRefreshTokenByUserId(clientId);
  return await clientRepository.deleteClientById(clientId);
};

export default {
  getClients,
  getById,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
