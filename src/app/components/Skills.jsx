import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import AnimatedSection from './AnimatedSection.jsx';
import styles from './Skills.module.css';
import { createStagger, transition, usePrefersReducedMotion } from '../../utils/motionConfig.js';

const MotionArticle = motion.article;

const Skills = ({ headline, categories }) => {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <AnimatedSection id="skills" background="muted">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Capabilities</p>
          <h2>Skills</h2>
          <p className={styles.subtitle}>{headline || 'Technical and soft skills grouped by category.'}</p>
        </div>
      </div>
      <div className={styles.grid}>
        {(categories ?? []).map((category, index) => (
          <MotionArticle
            key={category.title}
            className={styles.card}
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...transition, ...createStagger(index, 0.1) }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.icon} aria-hidden="true">
                {category.title?.[0] ?? '•'}
              </div>
              <div>
                <p className={styles.cardEyebrow}>Category</p>
                <h3>{category.title}</h3>
              </div>
            </div>
            <div className={styles.tags}>
              {category.items?.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </MotionArticle>
        ))}
        {!categories?.length && <p className={styles.empty}>Add your skill groups to showcase expertise.</p>}
      </div>
    </AnimatedSection>
  );
};

Skills.propTypes = {
  headline: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
};

export default Skills;
