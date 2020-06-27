import { useEffect, useState } from 'react';

function useWindowFocus() {
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(
    document.hasFocus()
  );

  useEffect(() => {
    function handleFocus() {
      setIsWindowFocused(true);
    }

    function handleBlur() {
      setIsWindowFocused(false);
    }

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return isWindowFocused;
}

export default useWindowFocus;
