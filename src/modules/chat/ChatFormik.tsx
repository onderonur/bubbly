import React, { useCallback } from 'react';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import {
  removeSpaceAround,
  MAX_FILE_SIZE_IN_MB,
  validateFileType,
  validateFileSize,
} from '@src/modules/shared/SharedUtils';
import { ChatMessage } from './ChatTypes';
import { ID, Maybe } from '@shared/SharedTypes';
import { useSocketIo } from '@src/modules/socket-io/SocketIoContext';
import { useViewer } from '@src/modules/viewer/ViewerContext';
import { nanoid } from 'nanoid';
import { useChatMessages } from './ChatMessageContext';
import { ChatEvent } from '@shared/SocketIoEvents';
import { OnSubmitFn } from '../shared/SharedTypes';

const validationSchema = Yup.object({
  body: Yup.string()
    .label('Message')
    // A message body is required, when there is no file selected.
    .when('file', {
      is: (file: Maybe<File>) => !file,
      then: Yup.string().required(),
    })
    .transform(removeSpaceAround)
    .default(''),
  // https://github.com/formium/formik/issues/926#issuecomment-430906502
  file: Yup.mixed<Maybe<File>>()
    .test(
      'fileSize',
      `Max size should be ${MAX_FILE_SIZE_IN_MB} MB`,
      (value: Maybe<File>) => {
        try {
          if (value) {
            validateFileSize(value);
          }
          return true;
        } catch {
          return false;
        }
      },
    )
    .test('fileType', 'Only image files are allowed', (value: Maybe<File>) => {
      try {
        if (value) {
          validateFileType(value);
        }
        return true;
      } catch {
        return false;
      }
    })
    .default(null),
});

export type ChatFormValues = Yup.TypeOf<typeof validationSchema>;

export function useChatFormikContext() {
  return useFormikContext<ChatFormValues>();
}

const initialValues: ChatFormValues = validationSchema.getDefault();

export type ChatFormikProps = React.PropsWithChildren<{
  roomId: ID;
}>;

function ChatFormik({ roomId, children }: ChatFormikProps) {
  const { setMessages, receiveMessage } = useChatMessages();

  const socket = useSocketIo();
  const { viewer } = useViewer();

  const handleSubmit = useCallback<OnSubmitFn<ChatFormValues>>(
    (values, formikHelpers) => {
      if (!viewer) {
        return;
      }
      const { body, file } = values;
      const tempMessage: ChatMessage = {
        id: nanoid(),
        body: body ? removeSpaceAround(body) : null,
        author: viewer,
        timestamp: Date.now(),
        file,
        isTemporary: true,
      };
      receiveMessage(tempMessage);
      socket.emit(
        ChatEvent.CHAT_MESSAGE,
        roomId,
        tempMessage,
        (message: ChatMessage) => {
          setMessages((currentMessages) =>
            currentMessages.map((current) =>
              current.id === tempMessage.id ? message : current,
            ),
          );
        },
      );
      formikHelpers.setSubmitting(false);
      formikHelpers.resetForm();
      formikHelpers.validateForm();
    },
    [socket, receiveMessage, roomId, setMessages, viewer],
  );

  return (
    <Formik<ChatFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={handleSubmit}
    >
      {children}
    </Formik>
  );
}

export default ChatFormik;
