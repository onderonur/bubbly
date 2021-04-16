import { parseCookies, setCookie } from 'nookies';
import { Maybe } from '@shared/SharedTypes';
import { SettingsOptions } from './SettingsContext';

const SETTINGS_COOKIE_KEY = 'settings';

export function getSettingsFromCookie(
  ...args: Parameters<typeof parseCookies>
): Maybe<SettingsOptions> {
  try {
    const settings = JSON.parse(parseCookies(...args)[SETTINGS_COOKIE_KEY]);
    return settings;
  } catch {
    return null;
  }
}

export function persistSettingsCookie(settings: SettingsOptions) {
  setCookie(null, SETTINGS_COOKIE_KEY, JSON.stringify(settings));
}
