import PropTypes from 'prop-types';
import styles from './SectionCard.module.css';

const SectionCard = ({ title, description, actions, children }) => (
  <section className={styles.card}>
    <header className={styles.header}>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
    <div className={styles.body}>{children}</div>
  </section>
);

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node,
};

export default SectionCard;
