export interface Testimonial {
  id: string;
  name: string;
  business: string;
  quote: string;
  projectSlug?: string;
}

/** Real client testimonials only. Starts empty — hide sections when empty. */
export const testimonials: Testimonial[] = [];
