import 'emoji-mart/css/emoji-mart.css';
import React, { useCallback, useEffect } from 'react';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import {
  IconButton,
  useTheme,
  Popper,
  Grow,
  ClickAwayListener,
} from '@material-ui/core';
import { Picker, BaseEmoji, PickerProps } from 'emoji-mart';
import { useFormikContext, useField } from 'formik';
import usePopper from 'hooks/usePopper';
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

  const { anchorEl, openPopper, closePopper } = usePopper();

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
      closePopper();
    },
    [closePopper, name, setFieldValue, targetInput, value]
  );

  const theme = useTheme();

  return (
    <>
      <IconButton onClick={openPopper}>
        <InsertEmoticonIcon />
      </IconButton>
      {/* Popover messes with the emoji-mart's tabs. It scrolls to the wrong
      section. */}
      <Popper open={!!anchorEl} anchorEl={anchorEl} transition disablePortal>
        {({ TransitionProps, placement }) => {
          return (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <ClickAwayListener onClickAway={closePopper}>
                <Picker theme={theme.palette.type} onSelect={handleSelect} />
              </ClickAwayListener>
            </Grow>
          );
        }}
      </Popper>
    </>
  );
});

export default EmojiPicker;
