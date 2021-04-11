import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import BaseTextField from 'modules/shared/BaseTextField';
import useSocketIo from 'modules/socket-io/SocketIoContext';
import { ID } from 'modules/shared/SharedTypes';
import SendIcon from '@material-ui/icons/Send';
import { useViewer } from 'modules/viewer/ViewerContext';
import usePrevious from 'modules/shared/usePrevious';
import BaseForm from 'modules/shared/BaseForm';
import Stack from 'modules/shared/Stack';
import EmojiPicker from './EmojiPicker';
import { SubmitIconButton } from 'modules/shared/SubmitButton';
import useWindowFocus from './useWindowFocus';
import { ChatFormValues } from './ChatFormik';

const enterKeyCode = 13;

export interface ChatFormProps {
  roomId: ID;
}

const ChatForm = React.memo<ChatFormProps>(function ChatForm({ roomId }) {
  const socket = useSocketIo();
  const { viewer } = useViewer();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isWindowFocused = useWindowFocus();

  // Focus on the textarea when the window gets focused
  useEffect(() => {
    if (isWindowFocused) {
      inputRef.current?.focus();
    }
  }, [isWindowFocused]);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (viewer && isTyping !== prevIsTyping) {
      if (isTyping) {
        socket?.emit('started typing', roomId, viewer.id);
      } else {
        socket?.emit('finished typing', roomId, viewer.id);
      }
    }
  }, [
    socket,
    isTyping,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    prevIsTyping,
    roomId,
    viewer,
  ]);

  var prevIsTyping = usePrevious(isTyping);

  const typingTimerRef = useRef<NodeJS.Timeout>();

  const handleTyping = useCallback(() => {
    const typingTimer = typingTimerRef.current;
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    setIsTyping(true);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, []);

  const {
    submitForm,
    isSubmitting,
    values,
  } = useFormikContext<ChatFormValues>();

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  const { file } = values;

  useEffect(() => {
    inputRef.current?.focus();
  }, [file]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.which === enterKeyCode && !e.shiftKey) {
        // To prevent the event to create a new line
        e.preventDefault();
        // Then we just submit the form
        submitForm();
        // And we set the "isTyping" flag without waiting for the timer
        const typingTimer = typingTimerRef.current;
        if (typingTimer) {
          clearTimeout(typingTimer);
        }
        setIsTyping(false);
      }
    },
    [submitForm],
  );

  return (
    <BaseForm>
      <Stack spacing={1} alignItems="flex-end">
        <EmojiPicker name="body" targetInput={inputRef.current} />
        <BaseTextField
          inputRef={inputRef}
          name="body"
          placeholder="Type a message"
          fullWidth
          required
          multiline
          autoFocus
          hideErrors
          rowsMax={4}
          onChange={handleTyping}
          onKeyPress={handleKeyPress}
        />
        <SubmitIconButton>
          <SendIcon />
        </SubmitIconButton>
      </Stack>
    </BaseForm>
  );
});

export default ChatForm;
