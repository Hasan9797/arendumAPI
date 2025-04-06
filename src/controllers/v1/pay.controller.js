import AtmosTokenService from '../../services/pay/atmos-token.service.js';

const accessToken =
  'eyJ4NXQiOiJNell4TW1Ga09HWXdNV0kwWldObU5EY3hOR1l3WW1NNFpUQTNNV0kyTkRBelpHUXpOR00wWkdSbE5qSmtPREZrWkRSaU9URmtNV0ZoTXpVMlpHVmxOZyIsImtpZCI6Ik16WXhNbUZrT0dZd01XSTBaV05tTkRjeE5HWXdZbU00WlRBM01XSTJOREF6WkdRek5HTTBaR1JsTmpKa09ERmtaRFJpT1RGa01XRmhNelUyWkdWbE5nX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJhZG1pbiIsImF1dCI6IkFQUExJQ0FUSU9OIiwiYXVkIjoiVDdMdjUxWXAzT0hVZWpuZUtEWTFyTDlRbkJrYSIsIm5iZiI6MTc0Mzk0ODY1MCwiYXpwIjoiVDdMdjUxWXAzT0hVZWpuZUtEWTFyTDlRbkJrYSIsInNjb3BlIjoiZGVmYXVsdCIsImlzcyI6Imh0dHBzOlwvXC9hcGltYW4uYXRtb3MudXo6OTQ0M1wvb2F1dGgyXC90b2tlbiIsImV4cCI6MTc0Mzk1MjI1MCwiaWF0IjoxNzQzOTQ4NjUwLCJqdGkiOiJkYWE2MGQ2ZC0zY2E1LTRjOTItYjBlZi1hY2Y1NmZmNmIwYTEifQ.KdfWsp9VgjRv488uCCFJ1qFtANdyy7pzsVFs8pC0qZl05FmqZhcdyBczhDW_PRiYPjI-XAdc0kIlkCxcW7M7vfvQYvUzRWm-OjmAVl2gwghCyoUu-VRfTYKpq_msZKJDI2JI0ks23W-DQituWdKYf8aGoL9dG7fLiSiaX_j_enVGYc38cHdvB618A2U9n9a_YeE4UQbWYrinmXe2kbskQ_Yehz70hVdA6sv-kg8dSFGYoQoynE_JsH_XLmpv-dakmhMM_Xtt5Bz4HT6ekenevwLRHhCmHly3wcRLDvEDjvoV51rucyLFiKpoPUHPA1WgB6kmGxg9ALHCTp2kQPyO9g';
const test = async (req, res) => {
  try {
    const token = await AtmosTokenService.getRefreshToken(accessToken);
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.code,
    });
  }
};

const payAtmosAPI = async (req, res) => {};

export default {
  test,
  payAtmosAPI,
};
