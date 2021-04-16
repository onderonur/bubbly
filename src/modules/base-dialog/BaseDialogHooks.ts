import { useRouter } from 'next/router';
import { useState, useMemo, useCallback, useEffect } from 'react';

export function useDialogState() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const router = useRouter();

  // We close the drawer when a route change gets completed.
  useEffect(() => {
    const eventType = 'routeChangeComplete';

    router.events.on(eventType, closeDialog);

    return () => {
      router.events.off(eventType, closeDialog);
    };
  }, [closeDialog, router.events]);

  const result = useMemo(() => {
    return { isOpen, openDialog, closeDialog };
  }, [closeDialog, isOpen, openDialog]);

  return result;
}
