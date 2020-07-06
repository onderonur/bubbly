import React from 'react';
import useIsMobile from 'hooks/useIsMobile';

type IsMobileProps = React.PropsWithChildren<{
  fallback?: React.ReactNode;
}>;

function IsMobile({ children, fallback }: IsMobileProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default IsMobile;
