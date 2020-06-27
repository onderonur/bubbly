import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useFormikContext, useField } from 'formik';
import { ChatFormValues } from '../types';
import { useSnack } from 'contexts/BaseSnackbarContext';

interface ImagePickerProps {
  name: string;
}

const ImagePicker = React.memo<ImagePickerProps>(function ImagePicker({
  name,
}) {
  const [field] = useField<ChatFormValues>(name);
  const { setFieldValue } = useFormikContext<ChatFormValues>();

  const { error } = useSnack();

  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file?.type.startsWith('image/')) {
        error('Sorry, only images are allowed.');
        return;
      }
      setFieldValue(name, file);
    },
    [error, name, setFieldValue]
  );

  return (
    <div>
      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        hidden={true}
        {...field}
        // "input" doesn't accept "null" as a value.
        // So, we just set an empty string as a default value here.
        // Otherwise, we can't select a file, cancel it and select it again.
        // The same file is stays as "selected" in this input.
        // Thus, it doesn't let use to select it again.
        value={''}
        onChange={handleSelectFile}
      />
      <label htmlFor="icon-button-file">
        <IconButton
          aria-label="upload attachment"
          component="span"
          size="small"
        >
          <AttachFileIcon />
        </IconButton>
      </label>
    </div>
  );
});

export default ImagePicker;
