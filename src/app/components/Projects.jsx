import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import AnimatedSection from './AnimatedSection.jsx';
import styles from './Projects.module.css';
import { createStagger, transition, usePrefersReducedMotion } from '../../utils/motionConfig.js';

const MotionArticle = motion.article;

const Projects = ({ items }) => {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <AnimatedSection id="projects">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Showcase</p>
          <h2>Projects</h2>
          <p className={styles.subtitle}>Flagship work samples with links and tech stacks.</p>
        </div>
      </div>
      <div className={styles.list}>
        {(items ?? []).map((project, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <MotionArticle
              key={`${project.name}-${index}`}
              className={`${styles.project} ${isReversed ? styles.reversed : ''}`}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...transition, ...createStagger(index, 0.15) }}
            >
              <div className={styles.imageWrap}>
                {project.image ? (
                  <img src={project.image} alt={project.name} loading="lazy" />
                ) : (
                  <div className={styles.imageFallback}>
                    <span>{project.name?.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
                <div className={styles.overlay} />
              </div>
              <div className={styles.copy}>
                <p className={styles.category}>{project.category || 'Featured'}</p>
                <h3>{project.name}</h3>
                <p className={styles.description}>
                  {project.summary || 'Add a short description to tell the story behind this work.'}
                </p>
                <div className={styles.meta}>
                  <div className={styles.stack}>
                    {project.stack?.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className={styles.link}>
                      Visit
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </MotionArticle>
          );
        })}
        {!items?.length && <p className={styles.empty}>Add projects to highlight your shipped work.</p>}
      </div>
    </AnimatedSection>
  );
};

Projects.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      link: PropTypes.string,
      stack: PropTypes.arrayOf(PropTypes.string),
      summary: PropTypes.string,
      image: PropTypes.string,
      category: PropTypes.string,
    }),
  ),
};

export default Projects;
