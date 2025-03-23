import axios from 'axios';

const fetchAtmosToken = async () => {
  const consumerKey = process.env.CONSUMER_KEY;
  const consumerSecret = process.env.CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('Consumer Key yoki Secret topilmadi');
  }

  const authString = Buffer.from(
    'hWKDdQ8KNX5m_znpI4fwo2sQRS8a:p9_IC549SOF0nMCt1qMqEyEBaAka'
  ).toString('base64');

  const requestData = new URLSearchParams();
  requestData.append('grant_type', '8032');

  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://partner.atmos.uz/token',
      data: requestData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
      timeout: 15000,
    });

    return data; // { access_token, scope, token_type, expires_in }
  } catch (error) {
    throw error;
  }
};

// Express’da ishlatish
const getAtmosToken = async (req, res) => {
  try {
    const tokenData = await fetchAtmosToken();
    res.status(200).json(tokenData);
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
