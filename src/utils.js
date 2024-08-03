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
