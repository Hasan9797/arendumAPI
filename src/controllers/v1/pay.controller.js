import AtmosTokenService from '../../services/pay/atmos-token.service.js';

const accessToken =
  'eyJ4NXQiOiJNell4TW1Ga09HWXdNV0kwWldObU5EY3hOR1l3WW1NNFpUQTNNV0kyTkRBelpHUXpOR00wWkdSbE5qSmtPREZrWkRSaU9URmtNV0ZoTXpVMlpHVmxOZyIsImtpZCI6Ik16WXhNbUZrT0dZd01XSTBaV05tTkRjeE5HWXdZbU00WlRBM01XSTJOREF6WkdRek5HTTBaR1JsTmpKa09ERmtaRFJpT1RGa01XRmhNelUyWkdWbE5nX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJhZG1pbiIsImF1dCI6IkFQUExJQ0FUSU9OIiwiYXVkIjoiVDdMdjUxWXAzT0hVZWpuZUtEWTFyTDlRbkJrYSIsIm5iZiI6MTc0Mzk1NTk1NywiYXpwIjoiVDdMdjUxWXAzT0hVZWpuZUtEWTFyTDlRbkJrYSIsInNjb3BlIjoiZGVmYXVsdCIsImlzcyI6Imh0dHBzOlwvXC9hcGltYW4uYXRtb3MudXo6OTQ0M1wvb2F1dGgyXC90b2tlbiIsImV4cCI6MTc0Mzk1OTU1NywiaWF0IjoxNzQzOTU1OTU3LCJqdGkiOiJlOGZmOGQ3Mi05N2U3LTRmNzUtYmYwNS1kZTRjYWQ0NmNjODIifQ.PzP4jV3eZrfz4UCVV2ssZS4p_dUpC-BwKNdh336rMi7L-iDQgbIfsXMuB2WzywbryjpAVD6vqfvRJT2CvxmzOY7qBrLRKlyTkq_YFeFNXhVARMpHkpf3UYUkc1eAPXlgZPA6cPqj4k6Ub2MDNQt7lBF5sk35EbNkHsuMCu-RxvIvsVt6QbVWFNV0tukoORJgBYnrMJHCdpYkgtPcaVAC_9FnPJMNw6Y08r5osePyE1hU8gN-WYWxeHwCFy4y2liN-qBGAR4EjZgvWvTCvkKqnotz6xaJrmXtU4SwzdGW96ovr1O3keNmt0RmdcY3u05Y4YRbFPOECrjJFmpxQ--C4Q';
const test = async (req, res) => {
  try {
    const instance = new AtmosTokenService();
    const token = await instance.getRefreshToken(accessToken);

    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const payAtmosAPI = async (req, res) => {};

export default {
  test,
  payAtmosAPI,
};
