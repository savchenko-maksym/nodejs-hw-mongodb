import { isHttpError } from 'http-errors';
export const errorHandler = (error, req, res, next) => {
  if (error.isJoi) {
    return res.status(400).json({
      status: 400,
      errorMessage: 'Validation error',
      details: error.details.map(({ path, message }) => ({
        path,
        message,
      })),
    });
  }

  if (isHttpError(error)) {
    return res.status(error.status).json({
      status: error.status,
      errorMessage: error.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
