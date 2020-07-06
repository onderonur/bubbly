import React, { useState, useMemo, useContext } from 'react';

interface InviterContextValue {
  canInvite: boolean;
  setCanInvite: (canInvite: boolean) => void;
}

const AppLayoutContext = React.createContext<InviterContextValue>(
  {} as InviterContextValue
);

export function useInviter() {
  const value = useContext(AppLayoutContext);
  return value;
}

type InviterProviderProps = React.PropsWithChildren<{}>;

function InviterProvider({ children }: InviterProviderProps) {
  const [canInvite, setCanInvite] = useState(false);

  const contextValue = useMemo<InviterContextValue>(
    () => ({ canInvite, setCanInvite }),
    [canInvite]
  );

  return (
    <AppLayoutContext.Provider value={contextValue}>
      {children}
    </AppLayoutContext.Provider>
  );
}

export default InviterProvider;
