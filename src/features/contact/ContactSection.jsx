import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import EditableField from '../../components/common/EditableField/EditableField.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import { EditIcon, TrashIcon } from '../../components/icons/index.jsx';
import styles from './ContactSection.module.css';

const emptySocial = {
  label: '',
  url: '',
};

const ContactSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();
  const contact = data.contact;
  const socials = contact.socials ?? [];

  const [formState, setFormState] = useState(emptySocial);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const saveField = (field) => async (value) => {
    await updateSection('contact', { ...contact, [field]: value });
  };

  const resetForm = () => {
    setFormState(emptySocial);
    setEditingIndex(null);
    setFormOpen(false);
  };

  const startCreate = () => {
    setFormState(emptySocial);
    setEditingIndex(null);
    setFormOpen(true);
  };

  const startEdit = (index) => {
    setFormState(socials[index]);
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.label.trim() || !formState.url.trim()) return;

    const payload = {
      label: formState.label.trim(),
      url: formState.url.trim(),
    };

    const nextSocials =
      editingIndex === null
        ? [...socials, payload]
        : socials.map((item, idx) => (idx === editingIndex ? payload : item));

    await updateSection('contact', { ...contact, socials: nextSocials });
    resetForm();
  };

  const handleDelete = async (index) => {
    const accepted = await confirm({
      title: 'Delete link?',
      message: 'This social link will be removed from the contact section.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!accepted) return;

    const nextSocials = socials.filter((_, idx) => idx !== index);
    await updateSection('contact', { ...contact, socials: nextSocials });
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <div className={styles.grid}>
        <EditableField label="Email" value={contact.email} onSave={saveField('email')} placeholder="owner@domain.com" />
        <EditableField label="Phone" value={contact.phone} onSave={saveField('phone')} placeholder="+91-9876543210" />
        <EditableField label="Location" value={contact.location} onSave={saveField('location')} placeholder="Remote / Bangalore" />
        <EditableField label="Availability" value={contact.availability} onSave={saveField('availability')} placeholder="Responds within 24h" />
      </div>
      <div className={styles.socials}>
        {socials.map((item, index) => (
          <div key={`${item.label}-${item.url}`} className={styles.socialChip}>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.label}
            </a>
            {canEdit && (
              <div className={formStyles.listActions}>
                <button
                  type="button"
                  className={formStyles.buttonGhost}
                  onClick={() => startEdit(index)}
                  aria-label="Edit link"
                  title="Edit link"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  className={formStyles.buttonDanger}
                  onClick={() => handleDelete(index)}
                  aria-label="Delete link"
                  title="Delete link"
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>
        ))}
        {!socials.length && <p className={styles.empty}>Add social links for quick outreach.</p>}
      </div>
      {canEdit && (
        <div className={styles.editorArea}>
          {!formOpen ? (
            <div className={styles.addRow}>
              <button type="button" className={formStyles.buttonPrimary} onClick={startCreate}>
                Add social link
              </button>
            </div>
          ) : (
            <form className={formStyles.formShell} onSubmit={handleSubmit}>
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="social-label">Label</label>
                  <input
                    id="social-label"
                    value={formState.label}
                    onChange={(event) => setFormState((prev) => ({ ...prev, label: event.target.value }))}
                    placeholder="LinkedIn"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="social-url">URL</label>
                  <input
                    id="social-url"
                    value={formState.url}
                    onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    required
                  />
                </div>
              </div>
              <div className={formStyles.formActions}>
                <button type="button" className={formStyles.buttonGhost} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className={formStyles.buttonPrimary}>
                  {editingIndex === null ? 'Add link' : 'Update link'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SectionCard>
  );
};

ContactSection.propTypes = {
  meta: PropTypes.shape({ title: PropTypes.string, description: PropTypes.string }).isRequired,
};

export default ContactSection;
