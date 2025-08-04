// Utility function to get the correct image URL
export const getImageUrl = (imagePath: string): string => {
  const baseUrl = 'http://localhost:5000';
  
  // If the path already starts with http, it's a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If the path already starts with /api/uploads, it's the new format
  if (imagePath.startsWith('/api/uploads/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // If it's an old format path with uploads/, construct the URL
  if (imagePath.startsWith('uploads/')) {
    return `${baseUrl}/api/${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads directory
  return `${baseUrl}/api/uploads/${imagePath}`;
};

// Check if an image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
