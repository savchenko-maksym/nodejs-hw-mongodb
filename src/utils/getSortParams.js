export const getSortParams = (sortOrder = 'asc', sortBy = 'name') => {
  const field = sortBy || 'name';
  const order = sortOrder === 'desc' ? -1 : 1;
  return { field, order };
};
