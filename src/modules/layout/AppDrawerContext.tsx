import { useRouter } from 'next/router';
import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';

interface AppDrawerContextValue {
  isOpen: boolean;
  toggleDrawer: VoidFunction;
}

const AppDrawerContext = React.createContext<AppDrawerContextValue>(
  {} as AppDrawerContextValue,
);

export function useAppDrawer() {
  const value = useContext(AppDrawerContext);
  return value;
}

type AppDrawerProviderProps = React.PropsWithChildren<{}>;

export function AppDrawerProvider({ children }: AppDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  // We close the drawer when a route change gets completed.
  useEffect(() => {
    const eventType = 'routeChangeComplete';

    router.events.on(eventType, closeDrawer);

    return () => {
      router.events.off(eventType, closeDrawer);
    };
  }, [closeDrawer, router.events]);

  const toggleDrawer = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const contextValue = useMemo<AppDrawerContextValue>(() => {
    return { isOpen, toggleDrawer };
  }, [isOpen, toggleDrawer]);

  return (
    <AppDrawerContext.Provider value={contextValue}>
      {children}
    </AppDrawerContext.Provider>
  );
}

export default AppDrawerProvider;
