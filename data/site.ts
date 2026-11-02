export interface SocialLink {
  label: 'Instagram' | 'Facebook' | 'LinkedIn';
  href: string;
  placeholder?: boolean;
}

export interface SiteConfig {
  name: 'Brike Web';
  owner: string;
  domain: string;
  url: string;
  email: string;
  whatsappNumber: string; // international format, no +, no spaces
  whatsappDisplay: string;
  location: string;
  hours: string;
  tagline: string;
  description: string;
  about: string;
  socials: SocialLink[];
  nav: { label: string; href: string }[];
}

export const site: SiteConfig = {
  name: 'Brike Web',
  owner: 'Thanda Manuel',
  domain: 'brikeweb.co.za',
  url: 'https://brikeweb.co.za',
  email: 'brike.webdev@gmail.com',
  // TODO(Thanda): replace with your new WhatsApp Business number
  whatsappNumber: '27XXXXXXXXX',
  whatsappDisplay: '[[PLACEHOLDER: +27 XX XXX XXXX]]',
  location: 'Cape Town, South Africa',
  hours: 'Mon–Fri 8am–5pm',
  tagline: 'Your website first. You pay when you love it.',
  description:
    'Affordable, modern websites for Cape Town small businesses, built in days, not months. No deposit. You pay only when you love it.',
  about:
    "I'm Thanda Manuel, a web developer with over four years of experience building modern, fast and functional websites. Alongside web development, I work as a funding specialist, helping small businesses access the financial support they need to grow. I'm passionate about technology, creativity and helping businesses establish a stronger presence online. I enjoy turning ideas into digital experiences that not only look good but also serve a real purpose. Beyond work, I'm a husband and a proud father to a little boy. My family is my greatest motivation and reminds me of the importance of commitment, hard work and keeping my word. Through Brike Web, I bring together my technical experience and passion for helping businesses grow, one website at a time.",
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/thanda_manuel/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/thanda-manuel/' },
    { label: 'Facebook', href: 'https://facebook.com/profile.php?id=61596026195778' },
  ],
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Design your site', href: '/build' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
};
