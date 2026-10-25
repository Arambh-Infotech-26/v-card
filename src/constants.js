export const company = {
  name: 'Your Company Name',
  shortName: 'YC',
  tagline: 'Building what moves business forward',
  description: 'A thoughtful, modern team helping ambitious businesses turn ideas into useful digital experiences.',
  phone: '+91 00000 00000',
  email: 'hello@yourcompany.com',
  website: 'https://yourcompany.com',
  whatsapp: '',
  address: 'Your office address, City 000000',
  mapUrl: '',
  linkedin: '',
  brochureUrl: '',
  calendlyUrl: '',
  brand: {
    accent: '#22d3ee',
    accentStrong: '#0891b2',
    success: '#34d399',
  },
};

export const quickActions = [
  { key: 'phone', label: 'Call us', icon: '☎', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
  { key: 'whatsapp', label: 'WhatsApp', icon: '◌', value: company.whatsapp, href: company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}` : '' },
  { key: 'email', label: 'Email', icon: '✉', value: company.email, href: `mailto:${company.email}` },
  { key: 'website', label: 'Website', icon: '↗', value: company.website.replace(/^https?:\/\//, ''), href: company.website },
  { key: 'location', label: 'Find us', icon: '⌖', value: company.address, href: company.mapUrl },
  { key: 'linkedin', label: 'LinkedIn', icon: 'in', value: company.linkedin.replace(/^https?:\/\//, ''), href: company.linkedin },
].filter((action) => action.href);

export const primaryActions = [
  { key: 'contact', title: 'Add to contacts', subtitle: 'Save our details to your phone', icon: '＋' },
  { key: 'schedule', title: 'Schedule a meeting', subtitle: 'Find a convenient time to connect', icon: '◷', href: company.calendlyUrl },
  { key: 'brochure', title: 'Company profile', subtitle: 'Explore what we do', icon: '▣', href: company.brochureUrl },
  { key: 'share', title: 'Share this card', subtitle: 'Send our details to someone', icon: '⌯' },
];
