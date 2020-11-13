import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { useLocation } from 'react-router-dom';

interface AppDrawerContextValue {
  isOpen: boolean;
  toggleDrawer: VoidFunction;
}

const AppDrawerContext = React.createContext<AppDrawerContextValue>(
  {} as AppDrawerContextValue
);

export function useAppDrawer() {
  const value = useContext(AppDrawerContext);
  return value;
}

type AppDrawerProviderProps = React.PropsWithChildren<{}>;

export function AppDrawerProvider({ children }: AppDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
