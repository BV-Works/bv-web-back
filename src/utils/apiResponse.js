export const successResponse = (data, message = '') => {
  return {
    status: 'success',
    data,
    message,
  };
};

export const errorResponse = (message, code = 'ERROR', errors = null) => ({
  status: 'error',
  message,
  code,
  ...(errors && { errors }),
});

export const paginatedResponse = (data, meta) => {
  return {
    status: 'success',
    data,
    meta,
  };
};
