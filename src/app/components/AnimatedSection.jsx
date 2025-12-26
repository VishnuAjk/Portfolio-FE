import PropTypes from 'prop-types';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import styles from './AnimatedSection.module.css';
import { transition, fadeInUp, usePrefersReducedMotion } from '../../utils/motionConfig.js';

const MotionDiv = motion.div;

const AnimatedSection = ({ id, background, children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const reduceMotion = usePrefersReducedMotion();

  const { initial, animate } = fadeInUp(32);
  const resolvedAnimate = reduceMotion ? { opacity: 1, y: 0 } : isInView ? animate : initial;

  return (
    <section
      id={id}
      ref={ref}
      className={`${styles.section} ${background ? styles[background] : ''}`}
    >
      <MotionDiv
        className={styles.inner}
        initial={reduceMotion ? false : initial}
        animate={resolvedAnimate}
        transition={transition}
      >
        {children}
      </MotionDiv>
    </section>
  );
};

AnimatedSection.propTypes = {
  id: PropTypes.string,
  background: PropTypes.oneOf(['muted']),
  children: PropTypes.node.isRequired,
};

export default AnimatedSection;
