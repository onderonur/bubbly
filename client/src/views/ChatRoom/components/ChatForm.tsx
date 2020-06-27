import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import BaseTextField from 'components/BaseTextField';
import useSocketIo from 'contexts/SocketContext';
import { ID } from 'types';
import SendIcon from '@material-ui/icons/Send';
import { useViewer } from 'contexts/ViewerContext';
import usePrevious from 'hooks/usePrevious';
import BaseForm from 'components/BaseForm';
import Stack from 'components/Stack';
import EmojiPicker from 'views/ChatRoom/components/EmojiPicker';
import { SubmitIconButton } from 'components/SubmitButton';
import useWindowFocus from '../hooks/useWindowFocus';
import { ChatFormValues } from 'views/ChatRoom/types';

const ENTER_KEY_CODE = 13;

export interface ChatFormProps {
  roomId: ID;
}

const ChatForm = React.memo<ChatFormProps>(function ChatForm({ roomId }) {
  const io = useSocketIo();
  const viewer = useViewer();
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
        io?.emit('started typing', roomId, viewer.id);
      } else {
        io?.emit('finished typing', roomId, viewer.id);
      }
    }
  }, [
    io,
    isTyping,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    prevIsTyping,
    roomId,
    viewer,
  ]);

  var prevIsTyping = usePrevious(isTyping);

  const typingTimerRef = useRef<number>();

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

  const { submitForm, isSubmitting, values } = useFormikContext<
    ChatFormValues
  >();

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
      if (e.which === ENTER_KEY_CODE && !e.shiftKey) {
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
    [submitForm]
  );

  return (
    <BaseForm>
      <Stack spacing={1} alignItems="flex-end">
        <EmojiPicker name="body" targetInput={inputRef.current} />
        <BaseTextField
          inputRef={inputRef}
          name="body"
          placeholder="Type a message"
          variant="filled"
          fullWidth
          required
          multiline
          autoFocus
          hideErrors
          rowsMax={6}
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
