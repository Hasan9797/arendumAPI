export const responseSuccess = (data = {}) => {
  return {
    success: true,
    error: false,
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
