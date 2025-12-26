import PropTypes from 'prop-types';
import { useState } from 'react';
import SectionGrid from '../SectionGrid/SectionGrid.jsx';
import styles from './OwnerEditorPanel.module.css';

const OwnerEditorPanel = ({ sections, defaultOpen = false, open: controlledOpen, onToggle }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  if (!sections?.length) return null;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!open);
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  return (
    <div className={`${styles.panel} ${open ? styles.open : ''}`}>
      <div className={styles.bar}>
        <div>
          <p className={styles.title}>Owner editor</p>
          <p className={styles.subtitle}>Edit portfolio content without leaving the page.</p>
        </div>
        <button type="button" className={styles.toggle} onClick={handleToggle}>
          {open ? 'Hide editor' : 'Open editor'}
        </button>
      </div>
      {open && (
        <div className={styles.body}>
          <SectionGrid>{sections}</SectionGrid>
        </div>
      )}
    </div>
  );
};

OwnerEditorPanel.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.node),
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default OwnerEditorPanel;
