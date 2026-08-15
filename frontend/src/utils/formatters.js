export const formatFullName = (user = {}) => {
  if (!user) return 'User';
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || 'User';
};
export const formatDate = value => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};
