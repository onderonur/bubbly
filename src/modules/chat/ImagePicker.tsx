import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useField } from 'formik';
import { useSnack } from '@src/modules/snackbar/BaseSnackbarContext';
import {
  SUPPORTED_FILE_TYPES,
  validateFileType,
  validateFileSize,
} from '@src/modules/shared/SharedUtils';
import { ChatFormValues, useChatFormikContext } from './ChatFormik';

interface ImagePickerProps {
  name: string;
}

const ImagePicker = React.memo<ImagePickerProps>(function ImagePicker({
  name,
}) {
  const [field] = useField<ChatFormValues>(name);
  const { setFieldValue } = useChatFormikContext();

  const { error } = useSnack();

  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          validateFileType(file);
          validateFileSize(file);
          setFieldValue(name, file);
        } catch (err) {
          error(err.message);
        }
      }
    },
    [error, name, setFieldValue],
  );

  return (
    <div>
      <input
        accept={SUPPORTED_FILE_TYPES.join(',')}
        id={field.name}
        type="file"
        hidden={true}
        {...field}
        // "input" doesn't accept "null" as a value.
        // So, we just set an empty string as a default value here.
        // Otherwise, we can't select a file, cancel it and select it again.
        // The same file is stays as "selected" in this input.
        // Thus, it doesn't let use to select it again.
        value=""
        onChange={handleSelectFile}
      />
      <label htmlFor={field.name}>
        <IconButton aria-label="upload attachment" component="span">
          <AttachFileIcon />
        </IconButton>
      </label>
    </div>
  );
});

export default ImagePicker;
