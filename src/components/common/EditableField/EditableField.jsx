import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './EditableField.module.css';
import { useAuth } from '../../../hooks/useAuth.js';
import { useConfirmation } from '../../../hooks/useConfirmation.js';

const EditableField = ({ label, value, multiline = false, onSave, placeholder }) => {
  const [draft, setDraft] = useState(value ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();

  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  const handleSave = async () => {
    if (!canEdit || draft === value) {
      setIsEditing(false);
      return;
    }

    const accepted = await confirm({
      title: 'Apply changes?',
      message: 'This update will be pushed to all viewers immediately.',
      confirmLabel: 'Save & publish',
    });

    if (!accepted) return;

    setBusy(true);
    try {
      await onSave(draft);
    } finally {
      setBusy(false);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <p>{label}</p>
        {canEdit && !isEditing && (
          <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className={styles.editor}>
          {multiline ? (
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} />
          ) : (
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} />
          )}
          <div className={styles.actions}>
            <button type="button" onClick={() => setIsEditing(false)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className={styles.primary} onClick={handleSave} disabled={busy}>
              {busy ? 'Saving…' : 'Save' }
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.value}>{value || placeholder || 'Not set yet.'}</p>
      )}
    </div>
  );
};

EditableField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  multiline: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default EditableField;
