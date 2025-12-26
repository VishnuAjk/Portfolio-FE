import { Children, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SectionGrid.module.css';

const SectionReveal = ({ index, children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''}`}
      style={{ '--reveal-index': index }}
    >
      {children}
    </div>
  );
};

const SectionGrid = ({ children }) => {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <div className={styles.grid}>
      {items.map((child, index) => (
        <SectionReveal key={child.key ?? index} index={index}>
          {child}
        </SectionReveal>
      ))}
    </div>
  );
};

SectionGrid.propTypes = {
  children: PropTypes.node,
};

SectionReveal.propTypes = {
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default SectionGrid;
