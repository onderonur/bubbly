import 'emoji-mart/css/emoji-mart.css';
import React, { useCallback, useEffect } from 'react';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { IconButton, Popover, useTheme } from '@material-ui/core';
import { Picker, BaseEmoji, PickerProps } from 'emoji-mart';
import { useFormikContext, useField } from 'formik';
import usePopover from 'hooks/usePopover';
import { Maybe } from 'types';
import { isNullOrUndefined } from 'utils';

interface EmojiPickerProps {
  name: string;
  targetInput: Maybe<HTMLInputElement | HTMLTextAreaElement>;
}

const EmojiPicker = React.memo<EmojiPickerProps>(function EmojiPicker(props) {
  const [field] = useField<string>(props);
  const { value } = field;
  const { setFieldValue } = useFormikContext();

  const { name, targetInput } = props;

  const { anchorEl, openPopover, closePopover } = usePopover();

  // Focus on the input when the popover is closed.
  useEffect(() => {
    if (!anchorEl) {
      targetInput?.focus();
    }
  }, [anchorEl, targetInput]);

  const handleSelect = useCallback<NonNullable<PickerProps['onSelect']>>(
    (emoji: BaseEmoji) => {
      const cursorStart = targetInput?.selectionStart;
      const cursorEnd = targetInput?.selectionEnd;
      if (!isNullOrUndefined(cursorStart) && !isNullOrUndefined(cursorEnd)) {
        const textBeforeCursor = value.substring(0, cursorStart);
        const textAfterCursor = value.substring(cursorEnd, value.length);
        setFieldValue(
          name,
          `${textBeforeCursor}${emoji.native}${textAfterCursor}`
        );
      } else {
        setFieldValue(name, `${value}${emoji.native}`);
      }
      // It might be a better idea to use a "docked"
      // emoji selector (like whatsapp) instead of
      // repeatedly opening/closing the popover.
      closePopover();
    },
    [closePopover, name, setFieldValue, targetInput, value]
  );

  const theme = useTheme();

  return (
    <>
      <IconButton onClick={openPopover}>
        <InsertEmoticonIcon />
      </IconButton>
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={closePopover}>
        <Picker
          theme={theme.palette.type}
          set="apple"
          onSelect={handleSelect}
        />
      </Popover>
    </>
  );
});

export default EmojiPicker;
