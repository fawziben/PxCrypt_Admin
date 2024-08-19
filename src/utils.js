export const convertSize = (sizeInBytes) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = Number(sizeInBytes);
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// utils.js
export const formatSize = (sizeInBits) => {
  const units = ["bits", "Kb", "Mb", "Gb"];
  let size = sizeInBits;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^0[567][0-9]{8}$/;

  return phoneRegex.test(phoneNumber);
};
export const validatePasswordPolicy = (password) => {
  // Au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return regex.test(password);
};
