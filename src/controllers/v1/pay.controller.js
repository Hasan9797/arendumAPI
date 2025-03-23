import axios from 'axios';

const authAtmosAPI = async (req, res) => {
  try {
    const consumerKey = process.env.CONSUMER_KEY || 'your_consumer_key';
    const consumerSecret =
      process.env.CONSUMER_SECRET || 'your_consumer_secret';
    const atmosAPIUrl = process.env.ATMOS_API_URL || 'your_atmos_api_url';

    console.log('Atmos API URL:', atmosAPIUrl);

    if (!consumerKey || !consumerSecret || !atmosAPIUrl) {
      return res
        .status(500)
        .json({ error: 'Atmos API autentifikatsiya muvaffaqiyatsiz.' });
    }

    // Basic Authentication uchun `consumerKey:consumerSecret` ni Base64 formatga o‘girish
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    console.log('Atmos API Consumer Key:', consumerKey);
    // Axios orqali so‘rov yuborish
    const response = await axios.post(
      `${atmosAPIUrl}/token`,
      'grant_type=client_credentials', // Form-data body
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        timeout: 5000, // 5 soniya timeout
      }
    );

    console.log('Atmos API Access Token:', response.data.access_token);

    res.status(200).json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
      token_type: response.data.token_type,
    });
  } catch (error) {
    console.error('Auth xatosi:', error.message);
    res
      .status(500)
      .json({ error: 'Atmos API autentifikatsiya muvaffaqiyatsiz.' });
  }
};

const payAtmosAPI = async (re, res) => {};

export default { authAtmosAPI, payAtmosAPI };
