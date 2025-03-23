import axios from 'axios';

const getAtmosToken = async (req, res) => {
  try {
    // .env faylidan username va password olish
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;

    // Username va password mavjudligini tekshirish
    if (!consumerKey || !consumerSecret) {
      throw new Error('Consumer key or secret not found!');
    }

    // Base64 kodlash: username:password
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    console.log('Sending request to Atmos API with credentials:', {
      username,
      password,
    });

    // Axios so‘rovi
    const response = await axios.post(
      'https://apigw.atmos.uz/token?grant_type=client_credentials', // Yangi URL
      null, // Body kerak emas
      {
        headers: {
          Authorization: `Basic ${credentials}`, // Base64 kodlangan credentials
          'Content-Type': 'application/x-www-form-urlencoded', // Hujjatda talab qilinmasa ham, odatiy qo‘shildi
        },
        timeout: 15000, // 15 soniya
        // httpsAgent: new https.Agent({
        //   rejectUnauthorized: false, // SSL muammosi bo‘lsa, test uchun
        // }),
      }
    );

    console.log('Atmos API response:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Axios Error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname,
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
