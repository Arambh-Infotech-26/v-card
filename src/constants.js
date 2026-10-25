export const company = {
  name: 'Aarambh Technologies',
  shortName: 'AT',
  tagline: 'From Idea to Impact',
  description: 'A thoughtful, modern team helping ambitious businesses turn ideas into useful digital experiences.',
  phone: '+91 9146331541',
  email: 'info.arambh26@gmail.com',
  website: 'https://yourcompany.com',
  whatsapp: '',
  address: 'Your office address, City 000000',
  mapUrl: '',
  linkedin: '',
  brochureUrl: '',
  calendlyUrl: '',
  shareMessage: 'Hi, check this out — I found a company that may be a great fit for our tech requirements.',
  brand: {
    accent: '#d49a19',
    accentStrong: '#9d6500',
    success: '#39a96b',
  },
  visitorCounter: {
    namespace: 'aarambh-digital-vcard',
    key: 'company-card',
  },
};

export const quickActions = [
  { key: 'phone', label: 'Call', title: 'Call us', detailLabel: 'Phone number', icon: 'phone', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
  { key: 'whatsapp', label: 'WhatsApp', title: 'WhatsApp', detailLabel: 'Chat with us', icon: 'whatsapp', value: company.whatsapp || 'Add a WhatsApp number in constants.js', href: company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}` : '' },
  { key: 'email', label: 'Email', title: 'Email', detailLabel: 'Email address', icon: 'mail', value: company.email, href: `mailto:${company.email}` },
  { key: 'website', label: 'Website', title: 'Website', detailLabel: 'Company website', icon: 'globe', value: company.website.replace(/^https?:\/\//, ''), href: company.website },
  { key: 'location', label: 'Navigate', title: 'Office location', detailLabel: 'Find us on the map', icon: 'map-pin', value: company.address, href: company.mapUrl },
  { key: 'linkedin', label: 'LinkedIn', title: 'LinkedIn', detailLabel: 'Connect with us', icon: 'linkedin', value: company.linkedin || 'Add a LinkedIn URL in constants.js', href: company.linkedin },
];

export const primaryActions = [
  { key: 'contact', title: 'Add to Contacts', subtitle: 'Save our details to your phone', icon: 'user-plus' },
  { key: 'schedule', title: 'Schedule Meeting', subtitle: 'Book a convenient time to connect', icon: 'calendar' },
  { key: 'brochure', title: 'Company Profile', subtitle: 'View our brochure (PDF)', icon: 'building' },
  { key: 'visit', title: "I'm Coming to Visit", subtitle: 'Share your live location with us', icon: 'navigation' },
  { key: 'share', title: 'Share / Refer a Friend', subtitle: 'Send this card to someone', icon: 'share' },
];
