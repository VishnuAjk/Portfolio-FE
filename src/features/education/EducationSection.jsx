import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import { EditIcon, TrashIcon } from '../../components/icons/index.jsx';
import styles from './EducationSection.module.css';

const emptyMilestone = {
  period: '',
  institution: '',
  detail: '',
};

const EducationSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();
  const milestones = data.education.milestones ?? [];

  const [formState, setFormState] = useState(emptyMilestone);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const resetForm = () => {
    setFormState(emptyMilestone);
    setEditingIndex(null);
    setFormOpen(false);
  };

  const startCreate = () => {
    setFormState(emptyMilestone);
    setEditingIndex(null);
    setFormOpen(true);
  };

  const startEdit = (index) => {
    setFormState(milestones[index]);
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.period.trim() || !formState.institution.trim()) return;

    const payload = {
      period: formState.period.trim(),
      institution: formState.institution.trim(),
      detail: formState.detail.trim(),
    };

    const nextMilestones =
      editingIndex === null
        ? [...milestones, payload]
        : milestones.map((item, idx) => (idx === editingIndex ? payload : item));

    await updateSection('education', { milestones: nextMilestones });
    resetForm();
  };

  const handleDelete = async (index) => {
    const accepted = await confirm({
      title: 'Delete milestone?',
      message: 'This education record will be removed.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!accepted) return;

    const nextMilestones = milestones.filter((_, idx) => idx !== index);
    await updateSection('education', { milestones: nextMilestones });
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <ul className={styles.list}>
        {milestones.map((item, index) => (
          <li key={`${item.period}-${item.institution}`}>
            <div className={styles.itemHead}>
              <div>
                <p className={styles.period}>{item.period}</p>
                <p className={styles.school}>{item.institution}</p>
              </div>
              {canEdit && (
                <div className={formStyles.listActions}>
                  <button
                    type="button"
                    className={formStyles.iconButton}
                    onClick={() => startEdit(index)}
                    aria-label="Edit milestone"
                  >
                    <EditIcon size={16} />
                    <span className={formStyles.iconButtonLabel}>Edit</span>
                  </button>
                  <button
                    type="button"
                    className={formStyles.iconButtonDanger}
                    onClick={() => handleDelete(index)}
                    aria-label="Delete milestone"
                  >
                    <TrashIcon size={16} />
                    <span className={formStyles.iconButtonLabel}>Delete</span>
                  </button>
                </div>
              )}
            </div>
            <p className={styles.detail}>{item.detail}</p>
          </li>
        ))}
        {!milestones.length && <p className={styles.empty}>Add academic credentials and certifications.</p>}
      </ul>
      {canEdit && (
        <div className={styles.editorArea}>
          {!formOpen ? (
            <div className={styles.addRow}>
              <button type="button" className={formStyles.buttonPrimary} onClick={startCreate}>
                Add milestone
              </button>
            </div>
          ) : (
            <form className={formStyles.formShell} onSubmit={handleSubmit}>
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="education-period">Period</label>
                  <input
                    id="education-period"
                    value={formState.period}
                    onChange={(event) => setFormState((prev) => ({ ...prev, period: event.target.value }))}
                    placeholder="2011 – 2015"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="education-institution">Institution</label>
                  <input
                    id="education-institution"
                    value={formState.institution}
                    onChange={(event) => setFormState((prev) => ({ ...prev, institution: event.target.value }))}
                    placeholder="IIIT"
                    required
                  />
                </div>
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="education-detail">Detail</label>
                <textarea
                  id="education-detail"
                  value={formState.detail}
                  onChange={(event) => setFormState((prev) => ({ ...prev, detail: event.target.value }))}
                  placeholder="B.Tech Computer Science"
                />
              </div>
              <div className={formStyles.formActions}>
                <button type="button" className={formStyles.buttonGhost} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className={formStyles.buttonPrimary}>
                  {editingIndex === null ? 'Add milestone' : 'Update milestone'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SectionCard>
  );
};

EducationSection.propTypes = {
  meta: PropTypes.shape({ title: PropTypes.string, description: PropTypes.string }).isRequired,
};

export default EducationSection;
