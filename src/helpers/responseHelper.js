export const responseSuccess = (data = {}) => {
  return {
    success: true,
    data,
  };
};

export const responseError = (message, code = 500) => {
  return {
    success: false,
    error: {
      message,
      code,
    },
  };
};
