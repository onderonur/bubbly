import { useState, useMemo } from 'react';

function useDialogState() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const result = useMemo(() => {
    const openDialog = () => {
      setIsOpen(true);
    };

    const closeDialog = () => {
      setIsOpen(false);
    };

    return { isOpen, openDialog, closeDialog };
  }, [isOpen]);

  return result;
}

export default useDialogState;
