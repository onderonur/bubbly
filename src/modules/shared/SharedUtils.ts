import dayjs from 'dayjs';
import { setCookie, parseCookies } from 'nookies';

// Note for "create-react-app": Proxying request by using package.json
// makes socket-io to fallback polling instead of using websockets.
// And if we use "http-proxy-middleware", create-react-app's hot reload get broken.
// To prevent these, we use hardcoded a API_URL.
export const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function handleResponse(response: Response) {
  if (response.ok) {
    return await response.json();
  }
  let message = response.statusText;

  try {
    const errorJson = await response.json();
    message = errorJson.message;
    // eslint-disable-next-line no-empty
  } catch {}

  const error = new Error(message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error as any).response = response;
  throw error;
}

export const api = {
  get: (url: string) => fetch(`${API_URL}${url}`).then(handleResponse),
};

export const DATE_TIME_FORMATS = {
  dateTime: 'DD/MM/YYYY HH:mm',
  time: 'HH:mm',
};

export function formatDateTime(date: dayjs.ConfigType, format: string) {
  return dayjs(date).format(format);
}

// Remove all spaces around the string.
// Including "new line"s.
export function removeSpaceAround(str: string) {
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
  setCookie(null, tokenKey, token);
}

export function getToken() {
  const cookies = parseCookies();
  return cookies[tokenKey];
}

export const MAX_FILE_SIZE_IN_MB = 1;
export const SUPPORTED_FILE_TYPES = ['image/*'];

function convertByteToMB(byte: number) {
  return byte / (1024 * 1024);
}

export function validateFileType(file: File) {
  const fileTypePrefix = file.type.split('/')[0];
  const isValid = SUPPORTED_FILE_TYPES.some((type) => {
    const currentPrefix = type.split('/')[0];
    return fileTypePrefix === currentPrefix;
  });
  if (!isValid) {
    throw new Error('Only image files are allowed.');
  }
}

export function validateFileSize(file: File) {
  if (convertByteToMB(file.size) > MAX_FILE_SIZE_IN_MB) {
    throw new Error(`Max file size should be ${MAX_FILE_SIZE_IN_MB} MB.`);
  }
}

export function isServer() {
  return typeof window === 'undefined';
}
