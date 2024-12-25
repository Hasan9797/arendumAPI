import clientRepository from '../repositories/client.repo.js';

const getClients = async (query) => {
  return await clientRepository.findAll(query);
};

const getClientById = async (id) => {
  return await clientRepository.getById(id);
};

const createClient = async (data) => {
  return await clientRepository.createClient(data);
};

const updateClient = async (id, data) => {
  return await clientRepository.updateClientById(id, data);
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
