import axios from 'axios';

const getAtmosToken = async (req, res) => {
  try {
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('Consumer Key yoki Secret mavjud emas!');
    }

    // Base64 kodlash (curl bilan bir xil)
    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    // Form-data (curl bilan bir xil)
    const requestData = new URLSearchParams();
    requestData.append('grant_type', 'client_credentials');

    console.log('Sending request to Atmos API with credentials:', {
      consumerKey,
      consumerSecret,
    });

    // Axios so‘rovi (curl bilan moslashtirildi)
    const response = await axios.post(
      'https://partner.atmos.uz/token',
      requestData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
          'User-Agent': 'curl/8.4.0', // curl'dagi User-Agent'ni qo‘shdim (agar server shunga qarab filtrlasa)
        },
        timeout: 10000, // 10 soniya (curl’da tez ishlagan bo‘lsa ham, xavfsizlik uchun oshirildi)
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // SSL muammosini chetlab o‘tish uchun (test uchun)
        }),
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
