import PropTypes from 'prop-types';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import AnimatedSection from './AnimatedSection.jsx';
import styles from './About.module.css';
import { slideIn, transition, usePrefersReducedMotion } from '../../utils/motionConfig.js';

const MotionDiv = motion.div;

const About = ({ summary, highlights, imageUrl, fallbackInitials = 'VP' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduceMotion = usePrefersReducedMotion();
  const left = slideIn('left', 50);
  const right = slideIn('right', 50);

  return (
    <AnimatedSection id="about">
      <div className={styles.grid} ref={ref}>
        <MotionDiv
          className={styles.imageCard}
          initial={reduceMotion ? false : left.initial}
          animate={reduceMotion ? undefined : isInView ? left.animate : left.initial}
          transition={transition}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" loading="lazy" />
          ) : (
            <div className={styles.imageFallback}>{fallbackInitials.slice(0, 2).toUpperCase()}</div>
          )}
        </MotionDiv>
        <MotionDiv
          className={styles.copy}
          initial={reduceMotion ? false : right.initial}
          animate={reduceMotion ? undefined : isInView ? right.animate : right.initial}
          transition={transition}
        >
          <p className={styles.summary}>{summary || 'Share your story and what drives your work.'}</p>
          {!!highlights?.length && (
            <ul className={styles.list}>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </MotionDiv>
      </div>
    </AnimatedSection>
  );
};

About.propTypes = {
  summary: PropTypes.string,
  highlights: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  fallbackInitials: PropTypes.string,
};

export default About;
