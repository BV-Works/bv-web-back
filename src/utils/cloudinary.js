export const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  const parts = url.split('/upload/');

  if (parts.length !== 2) {
    return null;
  }

  let publicId = parts[1];

  publicId = publicId.replace(/^v\d+\//, '');
  publicId = publicId.replace(/\.[^/.]+$/, '');

  return publicId;
};
