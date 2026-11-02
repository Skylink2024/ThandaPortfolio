export interface Testimonial {
  id: string;
  name: string;
  business: string;
  quote: string;
  projectSlug?: string;
  photo?: string;
  /** e.g. Google review link */
  sourceUrl?: string;
  date: string;
}

/** Real client testimonials only. Starts empty — hide sections when empty. */
export const testimonials: Testimonial[] = [];
