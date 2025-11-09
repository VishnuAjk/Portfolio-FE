import PropTypes from 'prop-types';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant }) => {
  if (!open) return null;
  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog} data-variant={variant}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.primary} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'danger']),
};

export default ConfirmDialog;
