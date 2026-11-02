export type PackageId = 'starter' | 'business' | 'google' | 'editor' | 'shop';
export type Billing = 'once' | 'month' | 'year' | 'hour';

export interface Capability {
  maxPages: number;
  seoSetup: boolean;
  gbpSetup: boolean;
  cmsEditor: boolean;
  shop: boolean;
  payments: boolean;
  gallery: boolean;
  maps: boolean;
}

export interface Package {
  id: PackageId;
  name: string;
  price: number; // once-off Rand
  popular?: boolean;
  tagline: string;
  whoFor: string;
  included: string[];
  notIncluded: string[];
  deliveryTime: string;
  capability: Capability;
}

export interface Extra {
  id:
    | 'domain'
    | 'hostingBasic'
    | 'hostingBusiness'
    | 'care'
    | 'extraChanges'
    | 'gbpSetup'
    | 'gbpCare'
    | 'seoOnce'
    | 'localSeo'
    | 'googleStarter'
    | 'extraPage';
  name: string;
  price: number;
  billing: Billing;
  description: string;
  group: 'essentials' | 'google' | 'support';
  exclusiveWith?: Extra['id'][];
  includedInPackages?: PackageId[];
}

export const ONCE_OFF_CAP = 15_000;

export const packages: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 2500,
    tagline: 'A beautiful one-page website to get you online fast.',
    whoFor:
      'New businesses, side hustles and anyone who needs a professional online presence quickly.',
    included: [
      '1-page website (all key info on one scrolling page)',
      'Mobile friendly design',
      'WhatsApp button',
      'Contact form',
      'Basic Google setup (your site can be found and indexed)',
    ],
    notIncluded: [
      'Extra pages',
      'SEO setup',
      'Google Business Profile setup',
      'Online shop or payments',
      'Domain and hosting (see extras)',
    ],
    deliveryTime: '3–5 working days',
    capability: {
      maxPages: 1,
      seoSetup: false,
      gbpSetup: false,
      cmsEditor: false,
      shop: false,
      payments: false,
      gallery: false,
      maps: false,
    },
  },
  {
    id: 'business',
    name: 'Business',
    price: 4500,
    popular: true,
    tagline: 'A complete website that shows everything you do.',
    whoFor:
      'Established small businesses like salons, barbers, cleaners and builders who want to look professional and show their services.',
    included: [
      'Up to 5 pages',
      'Gallery and services pages',
      'Contact form',
      'Google Maps',
      'Basic SEO (titles, descriptions, fast loading)',
      'Mobile friendly design',
      'WhatsApp button',
    ],
    notIncluded: [
      'Full SEO setup',
      'Google Business Profile setup',
      'Editor to change content yourself',
      'Online shop or payments',
      'Domain and hosting (see extras)',
    ],
    deliveryTime: '5–7 working days',
    capability: {
      maxPages: 5,
      seoSetup: false,
      gbpSetup: false,
      cmsEditor: false,
      shop: false,
      payments: false,
      gallery: true,
      maps: true,
    },
  },
  {
    id: 'google',
    name: 'Get Found on Google',
    price: 6900,
    tagline: 'Your Business website, plus everything to show up on Google.',
    whoFor:
      'Businesses that want local customers to find them when they search on Google and Google Maps.',
    included: [
      'Everything in Business',
      'SEO setup (keywords, page structure, sitemap, Search Console)',
      'Google Business Profile setup',
      'Up to 5 pages',
    ],
    notIncluded: [
      'Monthly Local SEO (see extras)',
      'Editor to change content yourself',
      'Online shop or payments',
      'Domain and hosting (see extras)',
    ],
    deliveryTime: '7–10 working days',
    capability: {
      maxPages: 5,
      seoSetup: true,
      gbpSetup: true,
      cmsEditor: false,
      shop: false,
      payments: false,
      gallery: true,
      maps: true,
    },
  },
  {
    id: 'editor',
    name: 'Edit It Yourself',
    price: 8900,
    tagline: 'A bigger website you can update yourself, any time.',
    whoFor:
      'Businesses that change prices, menus, photos or news often and want to do it themselves without paying for every edit.',
    included: [
      'Up to 8 pages',
      'Easy editor to update text and photos yourself',
      'Training session so you feel confident',
      'Gallery, services, contact form, Google Maps',
      'Basic SEO',
      'Mobile friendly design',
    ],
    notIncluded: [
      'Online shop or payments',
      'Full SEO setup and Google Business Profile (add as extras)',
      'Domain and hosting (see extras)',
    ],
    deliveryTime: '10–14 working days',
    capability: {
      maxPages: 8,
      seoSetup: false,
      gbpSetup: false,
      cmsEditor: true,
      shop: false,
      payments: false,
      gallery: true,
      maps: true,
    },
  },
  {
    id: 'shop',
    name: 'Online Shop',
    price: 12900,
    tagline: 'Sell online with products, cart and payments.',
    whoFor: 'Businesses ready to sell products online and take card or instant EFT payments.',
    included: [
      'Online store with products, cart and checkout',
      'Payments with PayFast or Yoco',
      'Up to 30 products loaded for you',
      'Shop pages plus Home, About and Contact',
      'Mobile friendly design',
      'Basic SEO',
    ],
    notIncluded: [
      'More than 30 products loaded (you can add more yourself)',
      'PayFast/Yoco transaction fees (charged by them)',
      'Full SEO and Google Business Profile (add as extras)',
      'Domain and hosting (see extras)',
    ],
    deliveryTime: '14–21 working days',
    capability: {
      maxPages: 8,
      seoSetup: false,
      gbpSetup: false,
      cmsEditor: true,
      shop: true,
      payments: true,
      gallery: true,
      maps: true,
    },
  },
];
// TODO(Thanda): confirm delivery times and what is included above.

export const extras: Extra[] = [
  {
    id: 'domain',
    name: 'Domain',
    price: 250,
    billing: 'year',
    group: 'essentials',
    description: 'Your own .co.za address, e.g. yourbusiness.co.za.',
  },
  {
    id: 'hostingBasic',
    name: 'Hosting (basic)',
    price: 199,
    billing: 'month',
    group: 'essentials',
    exclusiveWith: ['hostingBusiness'],
    description: 'Fast, secure hosting for most small business websites.',
  },
  {
    id: 'hostingBusiness',
    name: 'Hosting (business)',
    price: 349,
    billing: 'month',
    group: 'essentials',
    exclusiveWith: ['hostingBasic'],
    description: 'More power for shops, editors and busy sites, with business email support.',
  },
  {
    id: 'care',
    name: 'Care plan',
    price: 499,
    billing: 'month',
    group: 'support',
    description: 'Updates, backups and small edits every month, so you never have to worry.',
  },
  {
    id: 'extraChanges',
    name: 'Extra changes',
    price: 450,
    billing: 'hour',
    group: 'support',
    description: 'Bigger changes after launch, billed per hour. Not added to your quote total.',
  },
  {
    id: 'gbpSetup',
    name: 'Google Business Profile setup',
    price: 1200,
    billing: 'once',
    group: 'google',
    includedInPackages: ['google'],
    description: 'Get your business on Google Maps and Search with photos, hours and reviews.',
  },
  {
    id: 'gbpCare',
    name: 'Google Business care',
    price: 750,
    billing: 'month',
    group: 'google',
    description: 'I keep your Google profile fresh with posts, photos and review replies.',
  },
  {
    id: 'seoOnce',
    name: 'SEO once-off',
    price: 3500,
    billing: 'once',
    group: 'google',
    includedInPackages: ['google'],
    description: 'Full SEO setup: keyword research, page optimisation, sitemap and Search Console.',
  },
  {
    id: 'localSeo',
    name: 'Local SEO',
    price: 1950,
    billing: 'month',
    group: 'google',
    description: 'Ongoing work to rank higher in your area every month.',
  },
  {
    id: 'googleStarter',
    name: 'Google Starter bundle',
    price: 4200,
    billing: 'once',
    group: 'google',
    exclusiveWith: ['gbpSetup', 'seoOnce'],
    includedInPackages: ['google'],
    description: 'SEO once-off plus Google Business Profile setup together, for less.',
  },
  // TODO(Thanda): confirm extra page price
  {
    id: 'extraPage',
    name: 'Extra page',
    price: 450,
    billing: 'once',
    group: 'essentials',
    description: 'Each page beyond what your package includes.',
  },
];
