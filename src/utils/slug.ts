import slugify from 'slugify';

export function formatSlug(name: string) {
  return slugify(name, { lower: true, trim: true })
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
