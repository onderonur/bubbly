import { Response } from 'express';

// https://stackoverflow.com/a/14572494/10876256
export const trimSpaces = (str: string): string => {
  return str.replace(/^\s+|\s+$/g, '');
};

export const IS_DEV = process.env.NODE_ENV === 'development';

export const convertMBToByte = (mb: number): number => mb * 1024 * 1024;

export const addCacheControl = (
  res: Response,
  options: { maxAge: number; isPrivate?: boolean },
): void => {
  const { maxAge, isPrivate } = options;
  res.setHeader(
    'Cache-Control',
    `${isPrivate ? 'private' : 'public'}, max-age=${maxAge}`,
  );
};

const minutesInHour = 60;
const secondsInMinute = 60;

export const hoursToSeconds = (hours: number): number => {
  return hours * minutesInHour * secondsInMinute;
};
