import type { Industry } from './projects';

export type PresetId = 'modern' | 'luxury' | 'bold' | 'minimal' | 'playful' | 'corporate';
export type FontPairId =
  | 'modern'
  | 'luxury'
  | 'bold'
  | 'minimal'
  | 'playful'
  | 'corporate'
  | 'space-grotesk'
  | 'poppins';

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'gallery'
  | 'menu'
  | 'bookings'
  | 'shop'
  | 'blog'
  | 'contact';

export type FeatureId =
  | 'whatsapp'
  | 'contactForm'
  | 'maps'
  | 'booking'
  | 'payments'
  | 'shop'
  | 'blog'
  | 'multilingual';

export interface StylePreset {
  id: PresetId;
  name: string;
  vibe: string;
  headingFont: string;
  bodyFont: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
  radius: number;
  heroVariant: 'split' | 'centered' | 'fullbleed' | 'editorial';
  buttonStyle: 'pill' | 'rounded' | 'square';
}

export interface IndustryConfig {
  id: Industry;
  label: string;
  heroHeadline: string;
  services: { name: string; priceLabel: string }[];
  suggestedTaglines: string[];
}

export const stylePresets: StylePreset[] = [
  {
    id: 'modern',
    name: 'Modern',
    vibe: 'Clean, fresh and confident.',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    primary: '#1E6FFF',
    accent: '#0B1F3A',
    bg: '#FFFFFF',
    text: '#0F172A',
    radius: 14,
    heroVariant: 'split',
    buttonStyle: 'rounded',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    vibe: 'Elegant, calm and high-end.',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
    primary: '#B08D57',
    accent: '#111111',
    bg: '#FAF7F2',
    text: '#1A1A1A',
    radius: 2,
    heroVariant: 'editorial',
    buttonStyle: 'square',
  },
  {
    id: 'bold',
    name: 'Bold',
    vibe: 'Loud, strong, impossible to miss.',
    headingFont: 'Anton',
    bodyFont: 'Archivo',
    primary: '#FF3B30',
    accent: '#FFD60A',
    bg: '#0A0A0A',
    text: '#FFFFFF',
    radius: 0,
    heroVariant: 'fullbleed',
    buttonStyle: 'square',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    vibe: 'Simple, spacious, lets your work speak.',
    headingFont: 'DM Sans',
    bodyFont: 'DM Sans',
    primary: '#111111',
    accent: '#8A8A8A',
    bg: '#FFFFFF',
    text: '#111111',
    radius: 6,
    heroVariant: 'centered',
    buttonStyle: 'rounded',
  },
  {
    id: 'playful',
    name: 'Playful',
    vibe: 'Warm, friendly and full of personality.',
    headingFont: 'Fredoka',
    bodyFont: 'Nunito',
    primary: '#FF7A59',
    accent: '#2EC4B6',
    bg: '#FFF8F0',
    text: '#2B2D42',
    radius: 24,
    heroVariant: 'split',
    buttonStyle: 'pill',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    vibe: 'Trustworthy, professional and structured.',
    headingFont: 'Montserrat',
    bodyFont: 'Source Sans 3',
    primary: '#0B3D91',
    accent: '#00A3E0',
    bg: '#F7F9FC',
    text: '#1B2A41',
    radius: 8,
    heroVariant: 'centered',
    buttonStyle: 'rounded',
  },
];

export const industries: IndustryConfig[] = [
  {
    id: 'salon',
    label: 'Salon',
    heroHeadline: 'Beauty that feels like you',
    services: [
      { name: 'Cut & style', priceLabel: 'From R280 · Sample' },
      { name: 'Colour', priceLabel: 'From R450 · Sample' },
      { name: 'Treatment', priceLabel: 'From R320 · Sample' },
      { name: 'Bridal package', priceLabel: 'From R1,200 · Sample' },
    ],
    suggestedTaglines: ['Look your best', 'Beauty, done right', 'Your style, elevated'],
  },
  {
    id: 'barber',
    label: 'Barber',
    heroHeadline: '{name}: fresh cuts, sharp style',
    services: [
      { name: 'Classic cut', priceLabel: 'From R120 · Sample' },
      { name: 'Fade', priceLabel: 'From R150 · Sample' },
      { name: 'Beard trim', priceLabel: 'From R80 · Sample' },
      { name: 'Hot towel shave', priceLabel: 'From R180 · Sample' },
    ],
    suggestedTaglines: ['Sharp every time', 'Fresh cuts daily', 'Look the part'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    heroHeadline: 'Taste the best of {location}',
    services: [
      { name: 'Breakfast', priceLabel: 'From R85 · Sample' },
      { name: 'Lunch special', priceLabel: 'From R120 · Sample' },
      { name: 'Dinner mains', priceLabel: 'From R180 · Sample' },
      { name: 'Family platter', priceLabel: 'From R350 · Sample' },
    ],
    suggestedTaglines: ['Made with love', 'Local flavours', 'Come hungry'],
  },
  {
    id: 'tourism',
    label: 'Tourism',
    heroHeadline: 'Unforgettable tours in {location}',
    services: [
      { name: 'Half-day tour', priceLabel: 'From R650 · Sample' },
      { name: 'Full-day tour', priceLabel: 'From R1,200 · Sample' },
      { name: 'Private charter', priceLabel: 'From R2,500 · Sample' },
      { name: 'Airport transfer', priceLabel: 'From R450 · Sample' },
    ],
    suggestedTaglines: ['See more', 'Local guides', 'Memories that last'],
  },
  {
    id: 'cleaning',
    label: 'Cleaning',
    heroHeadline: 'Spotless homes and offices',
    services: [
      { name: 'Home clean', priceLabel: 'From R350 · Sample' },
      { name: 'Deep clean', priceLabel: 'From R650 · Sample' },
      { name: 'Office clean', priceLabel: 'From R500 · Sample' },
      { name: 'Move-out clean', priceLabel: 'From R900 · Sample' },
    ],
    suggestedTaglines: ['Spotless every time', 'Trusted cleaners', 'More time for you'],
  },
  {
    id: 'construction',
    label: 'Construction',
    heroHeadline: 'Built right, built to last',
    services: [
      { name: 'Renovations', priceLabel: 'Quote on request · Sample' },
      { name: 'Extensions', priceLabel: 'Quote on request · Sample' },
      { name: 'Roofing', priceLabel: 'Quote on request · Sample' },
      { name: 'Alterations', priceLabel: 'Quote on request · Sample' },
    ],
    suggestedTaglines: ['Quality craftsmanship', 'On time, on budget', 'Built to last'],
  },
  {
    id: 'retail',
    label: 'Retail',
    heroHeadline: 'Shop our favourites',
    services: [
      { name: 'New arrivals', priceLabel: 'From R199 · Sample' },
      { name: 'Bestsellers', priceLabel: 'From R149 · Sample' },
      { name: 'Gift sets', priceLabel: 'From R299 · Sample' },
      { name: 'Sale picks', priceLabel: 'From R99 · Sample' },
    ],
    suggestedTaglines: ['Fresh finds', 'Shop local', 'Something for everyone'],
  },
  {
    id: 'professional',
    label: 'Professional services',
    heroHeadline: 'Expert help you can trust',
    services: [
      { name: 'Consultation', priceLabel: 'From R500 · Sample' },
      { name: 'Retainer', priceLabel: 'From R2,500/mo · Sample' },
      { name: 'Project work', priceLabel: 'Quote on request · Sample' },
      { name: 'Workshops', priceLabel: 'From R1,500 · Sample' },
    ],
    suggestedTaglines: ['Clear advice', 'Results-focused', 'Your trusted partner'],
  },
  {
    id: 'other',
    label: 'Other',
    heroHeadline: 'Welcome to {name}',
    services: [
      { name: 'Service one', priceLabel: 'From R250 · Sample' },
      { name: 'Service two', priceLabel: 'From R450 · Sample' },
      { name: 'Service three', priceLabel: 'From R650 · Sample' },
      { name: 'Custom package', priceLabel: 'Quote on request · Sample' },
    ],
    suggestedTaglines: ['Built for you', 'Simple and clear', 'Get started today'],
  },
];

export const pagesCatalog: { id: PageId; label: string; alwaysOn?: boolean }[] = [
  { id: 'home', label: 'Home', alwaysOn: true },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'menu', label: 'Menu / Price list' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'shop', label: 'Shop' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export const featuresCatalog: { id: FeatureId; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp button' },
  { id: 'contactForm', label: 'Contact form' },
  { id: 'maps', label: 'Google Maps' },
  { id: 'booking', label: 'Online booking' },
  { id: 'payments', label: 'Online payments' },
  { id: 'shop', label: 'Product shop' },
  { id: 'blog', label: 'Blog' },
  { id: 'multilingual', label: 'Multilingual (EN/AF/XH)' },
];
