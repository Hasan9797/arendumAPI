import axios from 'axios';

const getAtmosToken = async (req, res) => {
  try {
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('Consumer Key yoki Secret mavjud emas!');
    }

    console.log("Auth uchun ma'lumotlar:", consumerKey, consumerSecret);

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    console.log('Auth base64:', credentials);

    const response = await axios.post(
      'https://partner.atmos.uz/token',
      'grant_type=8032',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        timeout: 5000,
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
