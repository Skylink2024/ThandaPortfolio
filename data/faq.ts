export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tags: ('general' | 'pricing' | 'process')[];
}

export const faqs: FaqItem[] = [
  {
    id: 'pay-nothing-upfront',
    question: 'Do I really pay nothing upfront?',
    answer:
      'Yes. There is no deposit. I build your website first, you review it, and you only pay once you approve it and it goes live.',
    tags: ['pricing', 'process'],
  },
  {
    id: 'how-long',
    question: 'How long does it take?',
    answer:
      "Most websites take 3 to 10 working days depending on the package. Online shops take 2 to 3 weeks. You'll get a preview link as soon as it's ready.",
    tags: ['process'],
  },
  {
    id: 'dont-like-it',
    question: "What if I don't like it?",
    answer:
      "Tell me what to change and I'll revise it. If it still isn't right for you, you walk away and pay nothing.",
    tags: ['process'],
  },
  {
    id: 'own-website',
    question: 'Do I own my website?',
    answer:
      "Yes. Once you've paid, the website and its content are yours. The domain is registered in your name.",
    tags: ['general'],
  },
  {
    id: 'monthly-costs',
    question: 'What are the monthly costs?',
    answer:
      'Only what you choose. Hosting is R199/month (basic) or R349/month (business). The care plan is R499/month for updates, backups and small edits. Your domain is R250/year.',
    tags: ['pricing'],
  },
  {
    id: 'google-business',
    question: 'Can you do my Google Business Profile?',
    answer:
      "Yes. Setup is R1,200 once-off, and Google Business care is R750/month if you want me to keep it active. It's already included in the Get Found on Google package.",
    tags: ['pricing'],
  },
  {
    id: 'what-is-seo',
    question: 'What is SEO and do I need it?',
    answer:
      'SEO helps Google show your website to people searching for what you do. A once-off setup is R3,500 and Local SEO is R1,950/month. The Google Starter bundle gives you SEO and Google Business setup for R4,200.',
    tags: ['pricing'],
  },
  {
    id: 'most-ill-pay',
    question: "What's the most I'll pay?",
    answer:
      'No once-off quote goes above R15,000. Most small business websites cost between R2,500 and R6,900.',
    tags: ['pricing'],
  },
  {
    id: 'update-myself',
    question: 'Can I update the website myself?',
    answer:
      'Yes, with the Edit It Yourself package (R8,900). It includes an easy editor and training.',
    tags: ['pricing'],
  },
  {
    id: 'get-paid-online',
    question: 'How do I get paid online?',
    answer:
      'The Online Shop package (R12,900) includes payments through PayFast or Yoco. They charge their own small transaction fees.',
    tags: ['pricing'],
  },
  {
    id: 'changes-later',
    question: 'What if I need changes later?',
    answer: 'Small edits are included in the care plan. Bigger changes are R450 per hour.',
    tags: ['pricing', 'process'],
  },
  {
    id: 'only-cape-town',
    question: 'Do you only work in Cape Town?',
    answer:
      "I'm based in Cape Town, but I build websites for businesses anywhere in South Africa, all online.",
    tags: ['general'],
  },
];
