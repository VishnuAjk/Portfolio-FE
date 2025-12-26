import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import styles from './Hero.module.css';
import { createStagger, transition, usePrefersReducedMotion } from '../../utils/motionConfig.js';
import ProfileAvatar from '../../components/common/ProfileAvatar/ProfileAvatar.jsx';

const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionDiv = motion.div;

const Hero = ({ title, subtitle, profileImageUrl, logoUrl, fallbackInitials, onEdit, showEditorShortcut }) => {
  const reduceMotion = usePrefersReducedMotion();
  const scrollTo = (id) => {
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.badgeRow}>
            <div className={styles.logo}>
              {logoUrl ? <img src={logoUrl} alt="Logo" /> : <span>{fallbackInitials}</span>}
            </div>
            <div className={styles.greeting}>Hello, I&apos;m</div>
          </div>
          <MotionH1
            className={styles.title}
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...transition, ...createStagger(0) }}
          >
            {title}
          </MotionH1>
          <MotionP
            className={styles.subtitle}
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...transition, ...createStagger(1) }}
          >
            {subtitle}
          </MotionP>
          <MotionDiv
            className={styles.ctaRow}
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...transition, ...createStagger(2) }}
          >
            <button type="button" className={styles.primary} onClick={() => scrollTo('#projects')}>
              View Work
            </button>
            <button type="button" className={styles.secondary} onClick={() => scrollTo('#contact')}>
              Get in Touch
            </button>
            {showEditorShortcut && (
              <button type="button" className={styles.tertiary} onClick={onEdit}>
                Open Control Panel
              </button>
            )}
          </MotionDiv>
        </div>
        <MotionDiv
          className={styles.portrait}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ ...transition, ...createStagger(3) }}
        >
          <ProfileAvatar imageUrl={profileImageUrl} fallbackText={fallbackInitials} alt={title} size="xl" />
        </MotionDiv>
      </div>
      <div className={styles.scrollIndicator}>
        <span />
      </div>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  profileImageUrl: PropTypes.string,
  logoUrl: PropTypes.string,
  fallbackInitials: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  showEditorShortcut: PropTypes.bool,
};

export default Hero;
