import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import AnimatedSection from './AnimatedSection.jsx';
import styles from './Contact.module.css';
import { createStagger, transition, usePrefersReducedMotion } from '../../utils/motionConfig.js';

const MotionLink = motion.a;

const Contact = ({ email, phone, location, availability, socials }) => {
  const reduceMotion = usePrefersReducedMotion();
  const contactHref = email ? `mailto:${email}` : undefined;

  return (
    <AnimatedSection id="contact" background="muted">
      <div className={styles.shell}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Contact</p>
          <h2>Let&apos;s build something together</h2>
          <p className={styles.subtitle}>
            {availability || 'Available for new projects and collaborations.'}
          </p>
          <div className={styles.metaGrid}>
            {email && <p><strong>Email:</strong> {email}</p>}
            {phone && <p><strong>Phone:</strong> {phone}</p>}
            {location && <p><strong>Location:</strong> {location}</p>}
          </div>
          {contactHref && (
            <button type="button" className={styles.primary} onClick={() => window.location.assign(contactHref)}>
              Email me
            </button>
          )}
        </div>
        <div className={styles.socials}>
          {(socials ?? []).map((item, index) => (
            <MotionLink
              key={`${item.label}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...transition, ...createStagger(index, 0.08) }}
            >
              <span className={styles.socialIcon}>{item.label?.[0] ?? '•'}</span>
              <span>{item.label}</span>
            </MotionLink>
          ))}
          {!socials?.length && <p className={styles.empty}>Add social links for quick outreach.</p>}
        </div>
      </div>
    </AnimatedSection>
  );
};

Contact.propTypes = {
  email: PropTypes.string,
  phone: PropTypes.string,
  location: PropTypes.string,
  availability: PropTypes.string,
  socials: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
};

export default Contact;
