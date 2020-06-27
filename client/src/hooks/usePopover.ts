import { useState, useMemo } from 'react';
import { Maybe } from 'types';

function usePopover() {
  const [anchorEl, setAnchorEl] = useState<Maybe<HTMLButtonElement>>(null);

  const result = useMemo(() => {
    const openPopover = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      setAnchorEl(e.currentTarget);
    };

    const closePopover = () => {
      setAnchorEl(null);
    };

    return { anchorEl, openPopover, closePopover };
  }, [anchorEl]);

  return result;
}

export default usePopover;
