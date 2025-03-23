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

    const response = await axios.post(
      'https://partner.atmos.uz/token',
      'grant_type=T7Lv51Yp3OHUejneKDY1rL9QnBka',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        timeout: 15000, // Timeoutni oshiramiz
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
