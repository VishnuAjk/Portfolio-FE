import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import { EditIcon, TrashIcon } from '../../components/icons/index.jsx';
import styles from './PersonalJourneySection.module.css';

const emptyMilestone = {
  period: '',
  title: '',
  detail: '',
};

const PersonalJourneySection = ({ meta, adminView = false }) => {
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
      <div className={adminView ? styles.adminList : styles.timeline}>
        {!adminView && <div className={styles.verticalLine} aria-hidden="true" />}
        {timeline.map((item, index) => {
          const isRight = !adminView && index % 2 !== 0;
          const initial = item.title?.[0]?.toUpperCase() ?? '•';
          return (
            <div
              key={`${item.period}-${item.title}`}
              className={`${adminView ? styles.adminEntry : styles.entry} ${isRight ? styles.right : styles.left}`}
            >
              {!adminView && <div className={styles.node} aria-hidden="true" />}
              <article className={styles.card}>
                <header className={styles.cardHead}>
                  <div className={styles.icon}>{initial}</div>
                  <div className={styles.headCopy}>
                    <p className={styles.title}>{item.title}</p>
                    <p className={styles.period}>{item.period}</p>
                  </div>
                  {canEdit && adminView && (
                    <div className={`${styles.actions} ${formStyles.listActions}`}>
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
                </header>
                <p className={styles.detail}>{item.detail}</p>
              </article>
            </div>
          );
        })}
        {!timeline.length && <p className={styles.empty}>Capture key milestones from your journey.</p>}
      </div>
      {canEdit && adminView && (
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
  adminView: PropTypes.bool,
};

export default PersonalJourneySection;
