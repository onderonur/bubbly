import { useEffect, useState } from 'react';
import { isServer } from '../shared/SharedUtils';

function useWindowFocus() {
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(
    isServer() ? false : document.hasFocus(),
  );

  useEffect(() => {
    function handleFocus() {
      setIsWindowFocused(true);
    }

    function handleBlur() {
      setIsWindowFocused(false);
    }

    if (!isServer()) {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  return isWindowFocused;
}

export default useWindowFocus;
