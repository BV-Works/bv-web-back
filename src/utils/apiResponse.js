export const successResponse = (data, message = '') => {
  return {
    status: 'success',
    data,
    message,
  };
};

export const errorResponse = (message, code = 'INTERNAL_ERROR') => {
  return {
    status: 'error',
    message,
    code,
  };
};

export const paginatedResponse = (data, meta) => {
  return {
    status: 'success',
    data,
    meta,
  };
};
