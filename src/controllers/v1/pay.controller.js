import axios from 'axios';

const getAtmosToken = async (req, res) => {
  try {
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('Consumer Key yoki Secret mavjud emas!');
    }

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');
    const requestData = new URLSearchParams();
    requestData.append('grant_type', 'client_credentials');

    console.log('Sending request to Atmos API with credentials:', {
      consumerKey,
      consumerSecret,
    });

    const response = await axios.post(
      'https://partner.atmos.uz/token',
      requestData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        timeout: 15000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Test uchun (keyin o‘chiriladi)
        }),
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Axios Error:', {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response?.data,
    });
    res.status(500).json({
      message: 'Token olishda xatolik yuz berdi',
      error: error.message,
    });
  }
};

const payAtmosAPI = async (req, res) => {};

export default { getAtmosToken, payAtmosAPI };
