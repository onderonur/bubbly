import React, { useContext, useEffect, useMemo, useState } from 'react';
import { PaletteType } from '@material-ui/core';
import { Maybe } from '@shared/SharedTypes';
import { persistSettingsCookie } from './SettingsUtils';

export interface SettingsOptions {
  isSoundOn: boolean;
  themeType: PaletteType;
}

interface SettingsContextValue {
  settings: SettingsOptions;
  toggleIsSoundOn: VoidFunction;
  toggleTheme: VoidFunction;
}

const SettingsContext = React.createContext<SettingsContextValue>(
  {} as SettingsContextValue,
);

export function useSettings() {
  const value = useContext(SettingsContext);
  return value;
}

const defaultSettings: SettingsOptions = {
  isSoundOn: true,
  themeType: 'light',
};

type SettingsProviderProps = React.PropsWithChildren<{
  initialSettings: Maybe<SettingsOptions>;
}>;

function SettingsProvider({
  initialSettings,
  children,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsOptions>(
    initialSettings ?? defaultSettings,
  );

  const contextValue = useMemo(
    () => ({
      settings,
      toggleIsSoundOn: () => {
        setSettings((current) => ({
          ...current,
          isSoundOn: !current.isSoundOn,
        }));
      },
      toggleTheme: () =>
        setSettings((current) => {
          if (current.themeType === 'light') {
            return { ...current, themeType: 'dark' };
          }
          return { ...current, themeType: 'light' };
        }),
    }),
    [setSettings, settings],
  );

  useEffect(() => {
    persistSettingsCookie(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
