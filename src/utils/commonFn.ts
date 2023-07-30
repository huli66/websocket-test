export const genID = (prefix: string) => {
  const random = Math.random().toString(36).substr(3, 5);
  return `${prefix}_id_${Date.now()}${random}`;
};
