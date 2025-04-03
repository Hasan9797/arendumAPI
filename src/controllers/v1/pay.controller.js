import axios from 'axios';

const addClientCard = async (req, res) => {
  try {
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.code,
    });
  }
};

const payAtmosAPI = async (req, res) => { };

export default {
  addClientCard,
  payAtmosAPI
};