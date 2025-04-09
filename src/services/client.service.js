import clientRepository from '../repositories/client.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';

const getClients = async (lang, query) => {
  const result = await clientRepository.findAll(lang, query);
   return {
     data: formatResponseDates(result.data),
     pagination: result.pagination,
   };
};

const getClientById = async (lang, id) => {
  const client = await clientRepository.getById(lang, id);
  return formatResponseDates(client);
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

const deleteClient = async (id) => {
  return await clientRepository.deleteClientById(id);
};

export default {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
