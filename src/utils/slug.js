import Profile from '../models/Profile.js';

export const generateSlug = (text) => {
  const normalized = text.includes('@')
    ? text.split('@')[0]
    : text;

  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateUniqueSlug = async (value) => {
  const baseSlug = generateSlug(value);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Profile.findOne({
      where: { slug },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};