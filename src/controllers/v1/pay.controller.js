import axios from 'axios';

const getAtmosToken = async (req, res) => {
  try {
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    const response = await axios.post(
      'https://partner.atmos.uz/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Auth Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

const payAtmosAPI = async (req, res) => {};

export default { getAtmosToken, payAtmosAPI };
