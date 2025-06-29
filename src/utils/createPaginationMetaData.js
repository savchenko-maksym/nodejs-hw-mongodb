import createHttpError from 'http-errors';

export const createPaginationMetaData = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviuosPage = page !== 1 && page <= totalPages;
  const hasNextPage = totalPages > page;
  if (page > totalPages) {
    throw createHttpError(
      400,
      `current page ${page} more than total page ${totalPages}`,
    );
  }
  return {
    page,
    perPage,
    totatItems: count,
    totalPages,
    hasPreviuosPage,
    hasNextPage,
  };
};
