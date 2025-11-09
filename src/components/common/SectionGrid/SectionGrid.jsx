import PropTypes from 'prop-types';
import styles from './SectionGrid.module.css';

const SectionGrid = ({ children }) => <div className={styles.grid}>{children}</div>;

SectionGrid.propTypes = {
  children: PropTypes.node,
};

export default SectionGrid;
