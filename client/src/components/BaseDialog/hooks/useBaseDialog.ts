import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useDialogState() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const location = useLocation();

  useEffect(() => {
    closeDialog();
  }, [closeDialog, location]);

  const result = useMemo(() => {
    return { isOpen, openDialog, closeDialog };
  }, [closeDialog, isOpen, openDialog]);

  return result;
}

export default useDialogState;
