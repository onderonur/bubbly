import { ID } from 'types';
import dayjs from 'dayjs';

export const dateTimeFormats = {
  dateTime: 'DD/MM/YYYY HH:mm',
  time: 'HH:mm',
};

export function formatDateTime(date: dayjs.ConfigType, format: string) {
  return dayjs(date).format(format);
}

export function trimString(str: string) {
  return str.replace(/^\s+|\s+$/g, '');
}

type NullOrUndefined = null | undefined;

export function isNullOrUndefined(value: unknown): value is NullOrUndefined {
  return value === undefined || value === null;
}

export function getHelpingVerb(count: number) {
  if (count > 1) {
    return 'are';
  } else if (count === 1) {
    return 'is';
  }
  return '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOfType<T>(obj: any, keys: (keyof T)[]): obj is T {
  if (typeof obj !== 'object') {
    return false;
  }
  const objKeys = Object.keys(obj);
  return keys.every((key) => objKeys.includes(key as string));
}

const tokenKey = 'token';

export function storeToken(token: string) {
  localStorage.setItem(tokenKey, token);
}

export function getToken() {
  const token = localStorage.getItem(tokenKey);
  return token;
}

export const routes = {
  home: {
    path: () => '/',
  },
  rooms: {
    path: () => '/rooms',
    routes: {
      chatRoom: {
        path: (params: { roomId?: ID } = { roomId: ':roomId' }) =>
          `/rooms/${params.roomId}`,
      },
    },
  },
};
