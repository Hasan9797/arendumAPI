export const responseSuccess = (data = {}, message = 'process success') => {
  return {
    message,
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