import { createContext, useCallback, useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../components/feedback/ConfirmDialog.jsx';

const ConfirmationContext = createContext(null);

export const ConfirmationProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({ open: false });
  const deferred = useRef(null);

  const requestConfirmation = useCallback((options) => {
    setDialogState({
      open: true,
      title: options?.title ?? 'Confirm changes',
      message: options?.message ?? 'Do you want to apply these updates?',
      confirmLabel: options?.confirmLabel ?? 'Save changes',
      cancelLabel: options?.cancelLabel ?? 'Cancel',
      variant: options?.variant ?? 'primary',
    });

    return new Promise((resolve) => {
      deferred.current = resolve;
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    deferred.current?.(true);
    closeDialog();
  }, [closeDialog]);

  const handleCancel = useCallback(() => {
    deferred.current?.(false);
    closeDialog();
  }, [closeDialog]);

  return (
    <ConfirmationContext.Provider value={{ confirm: requestConfirmation }}>
      {children}
      <ConfirmDialog
        open={dialogState.open}
        title={dialogState.title}
        message={dialogState.message}
        confirmLabel={dialogState.confirmLabel}
        cancelLabel={dialogState.cancelLabel}
        variant={dialogState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
};

ConfirmationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirmationContext = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmationContext must be used inside ConfirmationProvider');
  }
  return context;
};
