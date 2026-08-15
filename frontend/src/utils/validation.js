export const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const getPasswordStrength = (password = '') => {
  if (!password) return {
    score: 0,
    label: 'Empty'
  };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return {
    score,
    label: 'Weak'
  };
  if (score === 2) return {
    score,
    label: 'Fair'
  };
  if (score === 3) return {
    score,
    label: 'Good'
  };
  return {
    score,
    label: 'Strong'
  };
};
export const validateRegister = ({
  fullName,
  email,
  phone,
  password,
  confirmPassword
}) => {
  const errors = {};
  if (!fullName?.trim()) errors.fullName = 'Full name is required.';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!phone?.trim()) errors.phone = 'Phone number is required.';
  const passwordStrength = getPasswordStrength(password);
  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (passwordStrength.score < 3) {
    errors.password = 'Use a stronger password with uppercase, numbers, and symbols.';
  }
  if (!confirmPassword || confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
};
export const validateLogin = ({
  email,
  password
}) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
};
export const validateProfile = ({
  fullName,
  email,
  phone
}) => {
  const errors = {};
  if (!fullName?.trim()) errors.fullName = 'Full name is required.';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!phone?.trim()) errors.phone = 'Phone number is required.';
  return errors;
};
export const validateChangePassword = ({
  currentPassword,
  newPassword,
  confirmPassword
}) => {
  const errors = {};
  if (!currentPassword) errors.currentPassword = 'Current password is required.';
  if (!newPassword || newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters long.';
  }
  if (!confirmPassword || confirmPassword !== newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
};
