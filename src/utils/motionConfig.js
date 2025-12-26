import { useEffect, useState } from 'react';

export const transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

export const createStagger = (index, step = 0.08) => ({
  delay: index * step,
});

export const fadeInUp = (offset = 40) => ({
  initial: { opacity: 0, y: offset },
  animate: { opacity: 1, y: 0 },
});

export const slideIn = (direction = 'left', offset = 60) => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const delta = direction === 'left' || direction === 'up' ? -offset : offset;
  return {
    initial: { opacity: 0, [axis]: delta },
    animate: { opacity: 1, [axis]: 0 },
  };
};

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setPrefersReducedMotion(event.matches);
    setPrefersReducedMotion(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};
