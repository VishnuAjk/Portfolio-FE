import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditableField from '../EditableField.jsx';

vi.mock('../../../../hooks/useAuth.js', () => ({
  useAuth: () => ({ canEdit: true }),
}));

vi.mock('../../../../hooks/useConfirmation.js', () => ({
  useConfirmation: () => ({
    confirm: () => Promise.resolve(true),
  }),
}));

describe('EditableField', () => {
  it('allows owners to edit and save content', async () => {
    const onSave = vi.fn(() => Promise.resolve());
    render(
      <EditableField label="Summary" value="Old" onSave={onSave} placeholder="" />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText(/edit/i));
    const input = screen.getByDisplayValue('Old');
    await user.clear(input);
    await user.type(input, 'New value');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith('New value');
  });
});
