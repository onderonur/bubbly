import { useState, useCallback, useMemo } from 'react';
import { Maybe } from 'types';

function usePopover() {
  const [anchorEl, setAnchorEl] = useState<Maybe<HTMLButtonElement>>(null);

  const openPopper = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setAnchorEl(e.currentTarget);
    },
    []
  );

  const closePopper = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const result = useMemo(
    () => ({
      anchorEl,
      openPopper,
      closePopper,
    }),
    [anchorEl, closePopper, openPopper]
  );

  return result;
}

export default usePopover;
