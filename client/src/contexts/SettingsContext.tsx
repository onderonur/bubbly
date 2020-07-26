import React, { useContext, useMemo } from 'react';
import { PaletteType } from '@material-ui/core';
import useSyncLocalStorage from 'hooks/useSyncLocalStorage';

interface SettingsOptions {
  isSoundOn: boolean;
  themeType: PaletteType;
}

interface SettingsContextValue {
  settings: SettingsOptions;
  toggleIsSoundOn: VoidFunction;
  toggleTheme: VoidFunction;
}

const SettingsContext = React.createContext<SettingsContextValue>(
  {} as SettingsContextValue
);

export function useSettings() {
  const value = useContext(SettingsContext);
  return value;
}

type SettingsProviderProps = React.PropsWithChildren<{}>;

function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useSyncLocalStorage<SettingsOptions>(
    'settings',
    {
      isSoundOn: true,
      themeType: 'light',
    }
  );

  const contextValue = useMemo(
    () => ({
      settings,
      toggleIsSoundOn: () =>
        setSettings((current) => ({
          ...current,
          isSoundOn: !current.isSoundOn,
        })),
      toggleTheme: () =>
        setSettings((current) => {
          if (current.themeType === 'light') {
            return { ...current, themeType: 'dark' };
          }
          return { ...current, themeType: 'light' };
        }),
    }),
    [setSettings, settings]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
