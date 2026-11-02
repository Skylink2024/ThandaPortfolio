import type { Transition, Variants } from 'framer-motion';

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 30 } as const satisfies Transition,
  snappy: { type: 'spring', stiffness: 500, damping: 35 } as const satisfies Transition,
};

export const duration = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  hero: 0.9,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export function stagger(staggerChildren = 0.06): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
      },
    },
  };
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: ease.out },
  },
};

export const wordReveal: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const wordRevealChild: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
};
