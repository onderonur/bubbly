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

export const maxFileSizeInMB = 1;
export const supportedFileTypes = ['image/*'];

function convertByteToMB(byte: number) {
  return byte / (1024 * 1024);
}

export function validateFileType(file: File) {
  const fileTypePrefix = file.type.split('/')[0];
  const isValid = supportedFileTypes.some((type) => {
    const currentPrefix = type.split('/')[0];
    return fileTypePrefix === currentPrefix;
  });
  if (!isValid) {
    throw new Error('Only image files are allowed.');
  }
}

export function validateFileSize(file: File) {
  if (convertByteToMB(file.size) > maxFileSizeInMB) {
    throw new Error(`Max file size should be ${maxFileSizeInMB} MB.`);
  }
}
