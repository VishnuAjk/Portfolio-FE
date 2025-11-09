import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import styles from './PersonalJourneySection.module.css';

const emptyMilestone = {
  period: '',
  title: '',
  detail: '',
};

const PersonalJourneySection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();
  const timeline = data.journey.timeline ?? [];

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
    setFormState(timeline[index]);
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      period: formState.period.trim(),
      title: formState.title.trim(),
      detail: formState.detail.trim(),
    };
    if (!payload.period || !payload.title) return;

    const nextTimeline =
      editingIndex === null
        ? [...timeline, payload]
        : timeline.map((entry, idx) => (idx === editingIndex ? payload : entry));

    await updateSection('journey', { timeline: nextTimeline });
    resetForm();
  };

  const handleDelete = async (index) => {
    const accepted = await confirm({
      title: 'Delete milestone?',
      message: 'This journey point will be removed from the public timeline.',
      confirmLabel: 'Delete milestone',
      variant: 'danger',
    });
    if (!accepted) return;

    const nextTimeline = timeline.filter((_, idx) => idx !== index);
    await updateSection('journey', { timeline: nextTimeline });
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <ol className={styles.timeline}>
        {timeline.map((item, index) => (
          <li key={`${item.period}-${item.title}`}>
            <div className={styles.timelineHead}>
              <div>
                <p className={styles.period}>{item.period}</p>
                <p className={styles.title}>{item.title}</p>
              </div>
              {canEdit && (
                <div className={formStyles.listActions}>
                  <button type="button" className={formStyles.buttonGhost} onClick={() => startEdit(index)}>
                    Edit
                  </button>
                  <button type="button" className={formStyles.buttonDanger} onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className={styles.detail}>{item.detail}</p>
          </li>
        ))}
        {!timeline.length && <p className={styles.empty}>Capture key milestones from your journey.</p>}
      </ol>
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
                  <label htmlFor="journey-period">Period</label>
                  <input
                    id="journey-period"
                    value={formState.period}
                    onChange={(event) => setFormState((prev) => ({ ...prev, period: event.target.value }))}
                    placeholder="2015"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="journey-title">Title</label>
                  <input
                    id="journey-title"
                    value={formState.title}
                    onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Graduated CS"
                    required
                  />
                </div>
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="journey-detail">Detail</label>
                <textarea
                  id="journey-detail"
                  value={formState.detail}
                  onChange={(event) => setFormState((prev) => ({ ...prev, detail: event.target.value }))}
                  placeholder="Discovered the world of distributed systems."
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

PersonalJourneySection.propTypes = {
  meta: PropTypes.shape({ title: PropTypes.string, description: PropTypes.string }).isRequired,
};

export default PersonalJourneySection;
