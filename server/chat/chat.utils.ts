import FileType from 'file-type';

export const isImageFile = async (file: Buffer): Promise<boolean> => {
  const fileType = await FileType.fromBuffer(file);
  return !!fileType?.mime.startsWith('image/');
};
