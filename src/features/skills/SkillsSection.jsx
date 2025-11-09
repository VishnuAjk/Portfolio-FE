import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import EditableField from '../../components/common/EditableField/EditableField.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import styles from './SkillsSection.module.css';

const emptyCategory = {
  title: '',
  itemsInput: '',
};

const SkillsSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();
  const skills = data.skills;
  const categories = skills.categories ?? [];

  const [formState, setFormState] = useState(emptyCategory);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const resetForm = () => {
    setFormState(emptyCategory);
    setEditingIndex(null);
    setFormOpen(false);
  };

  const handleHeadlineSave = async (nextValue) => {
    await updateSection('skills', { ...skills, headline: nextValue });
  };

  const startCreate = () => {
    setFormState(emptyCategory);
    setEditingIndex(null);
    setFormOpen(true);
  };

  const startEdit = (index) => {
    const category = categories[index];
    setFormState({
      title: category.title,
      itemsInput: category.items?.join(', ') ?? '',
    });
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleDelete = async (index) => {
    const accepted = await confirm({
      title: 'Delete category?',
      message: 'This skill group will be removed for all visitors.',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!accepted) return;

    const nextCategories = categories.filter((_, idx) => idx !== index);
    await updateSection('skills', { ...skills, categories: nextCategories });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: formState.title.trim(),
      items: formState.itemsInput
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean),
    };

    if (!payload.title) {
      return;
    }

    const nextCategories =
      editingIndex === null
        ? [...categories, payload]
        : categories.map((category, idx) => (idx === editingIndex ? payload : category));

    await updateSection('skills', { ...skills, categories: nextCategories });
    resetForm();
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <EditableField
        label="Skills headline"
        value={skills.headline}
        placeholder="e.g. Building resilient cloud-native products."
        onSave={handleHeadlineSave}
      />
      <div className={styles.tags}>
        {categories.map((category, index) => (
          <div key={category.title} className={styles.category}>
            <div className={styles.categoryHeader}>
              <p>{category.title}</p>
              {canEdit && (
                <div className={formStyles.listActions}>
                  <button type="button" className={formStyles.buttonGhost} onClick={() => startEdit(index)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={formStyles.buttonDanger}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div>
              {category.items?.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
        {!categories.length && <p className={styles.empty}>Add your first skill group to highlight expertise.</p>}
      </div>
      {canEdit && (
        <div className={styles.editorArea}>
          {!formOpen ? (
            <div className={styles.addRow}>
              <button type="button" className={formStyles.buttonPrimary} onClick={startCreate}>
                Add skill group
              </button>
            </div>
          ) : (
            <form className={formStyles.formShell} onSubmit={handleSubmit}>
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="skill-title">Group title</label>
                  <input
                    id="skill-title"
                    value={formState.title}
                    onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Frontend"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="skill-items">Items (comma separated)</label>
                  <input
                    id="skill-items"
                    value={formState.itemsInput}
                    onChange={(event) => setFormState((prev) => ({ ...prev, itemsInput: event.target.value }))}
                    placeholder="React, Vite, Redux"
                  />
                </div>
              </div>
              <div className={formStyles.formActions}>
                <button type="button" className={formStyles.buttonGhost} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className={formStyles.buttonPrimary}>
                  {editingIndex === null ? 'Add group' : 'Update group'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SectionCard>
  );
};

SkillsSection.propTypes = {
  meta: PropTypes.shape({ title: PropTypes.string, description: PropTypes.string }).isRequired,
};

export default SkillsSection;
