import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import styles from './WorkExperienceSection.module.css';

const emptyRole = {
  title: '',
  company: '',
  period: '',
  summary: '',
};

const WorkExperienceSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();
  const roles = data.work.roles ?? [];

  const [formState, setFormState] = useState(emptyRole);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const resetForm = () => {
    setFormState(emptyRole);
    setEditingIndex(null);
    setFormOpen(false);
  };

  const startCreate = () => {
    setFormState(emptyRole);
    setEditingIndex(null);
    setFormOpen(true);
  };

  const startEdit = (index) => {
    setFormState(roles[index]);
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: formState.title.trim(),
      company: formState.company.trim(),
      period: formState.period.trim(),
      summary: formState.summary.trim(),
    };

    if (!payload.title || !payload.company) {
      return;
    }

    const nextRoles =
      editingIndex === null
        ? [...roles, payload]
        : roles.map((role, idx) => (idx === editingIndex ? payload : role));

    await updateSection('work', { roles: nextRoles });
    resetForm();
  };

  const handleDelete = async (index) => {
    const accepted = await confirm({
      title: 'Delete role?',
      message: 'This experience entry will disappear for everyone viewing the site.',
      confirmLabel: 'Delete role',
      variant: 'danger',
    });
    if (!accepted) return;

    const nextRoles = roles.filter((_, idx) => idx !== index);
    await updateSection('work', { roles: nextRoles });
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <div className={styles.timeline}>
        {roles.map((role, index) => (
          <article key={`${role.company}-${role.title}-${role.period}`} className={styles.role}>
            <div className={styles.roleHead}>
              <div>
                <p className={styles.period}>{role.period}</p>
                <h3>{role.title}</h3>
                <p className={styles.company}>{role.company}</p>
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
            <p className={styles.summary}>{role.summary}</p>
          </article>
        ))}
        {!roles.length && <p className={styles.empty}>Add your professional experiences to build trust.</p>}
      </div>
      {canEdit && (
        <div className={styles.editorArea}>
          {!formOpen ? (
            <div className={styles.addRow}>
              <button type="button" className={formStyles.buttonPrimary} onClick={startCreate}>
                Add role
              </button>
            </div>
          ) : (
            <form className={formStyles.formShell} onSubmit={handleSubmit}>
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="role-title">Title</label>
                  <input
                    id="role-title"
                    value={formState.title}
                    onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Lead Engineer"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="role-company">Company</label>
                  <input
                    id="role-company"
                    value={formState.company}
                    onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
                    placeholder="Contoso"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="role-period">Period</label>
                  <input
                    id="role-period"
                    value={formState.period}
                    onChange={(event) => setFormState((prev) => ({ ...prev, period: event.target.value }))}
                    placeholder="2021 — Now"
                  />
                </div>
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="role-summary">Summary</label>
                <textarea
                  id="role-summary"
                  value={formState.summary}
                  onChange={(event) => setFormState((prev) => ({ ...prev, summary: event.target.value }))}
                  placeholder="Scaling the payments platform for 10M+ users."
                />
              </div>
              <div className={formStyles.formActions}>
                <button type="button" className={formStyles.buttonGhost} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className={formStyles.buttonPrimary}>
                  {editingIndex === null ? 'Add role' : 'Update role'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SectionCard>
  );
};

WorkExperienceSection.propTypes = {
  meta: PropTypes.shape({ title: PropTypes.string, description: PropTypes.string }).isRequired,
};

export default WorkExperienceSection;
