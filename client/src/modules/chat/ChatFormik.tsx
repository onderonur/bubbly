import React, { useCallback } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  removeSpaceAround,
  MAX_FILE_SIZE_IN_MB,
  validateFileType,
  validateFileSize,
} from 'modules/shared/SharedUtils';
import { ChatFormValues, ChatMessage } from './ChatTypes';
import { ID, OnSubmitFn } from 'modules/shared/SharedTypes';
import useSocketIo from 'modules/socket-io/SocketIoContext';
import { useViewer } from 'modules/viewer/ViewerContext';
import { nanoid } from 'nanoid';
import { useChatMessages } from './ChatMessageContext';

const initialValues: ChatFormValues = { body: '', file: null };

const validationSchema = Yup.object().shape<ChatFormValues>({
  body: Yup.string()
    .label('Message')
    // A message body is required, when there is no file selected.
    .when('file', {
      is: (file) => !file,
      then: Yup.string().required(),
    })
    .transform(removeSpaceAround),
  // https://github.com/formium/formik/issues/926#issuecomment-430906502
  file: Yup.mixed<ChatFormValues['file']>()
    .test(
      'fileSize',
      `Max size should be ${MAX_FILE_SIZE_IN_MB} MB`,
      // TODO: "value" needs some type fix here.
      (value) => {
        try {
          if (value) {
            validateFileSize(value);
          }
          return true;
        } catch {
          return false;
        }
      }
    )
    .test(
      'fileType',
      'Only image files are allowed',
      // TODO: "value" needs some type fix here.
      (value) => {
        try {
          if (value) {
            validateFileType(value);
          }
          return true;
        } catch {
          return false;
        }
      }
    ),
});

export type ChatFormikProps = React.PropsWithChildren<{
  roomId: ID;
}>;

function ChatFormik({ roomId, children }: ChatFormikProps) {
  const { setMessages, receiveMessage } = useChatMessages();

  const io = useSocketIo();
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
      io?.emit('chat message', roomId, tempMessage, (message: ChatMessage) => {
        setMessages((currentMessages) =>
          currentMessages.map((current) =>
            current.id === tempMessage.id ? message : current
          )
        );
      });
      formikHelpers.setSubmitting(false);
      formikHelpers.resetForm();
      formikHelpers.validateForm();
    },
    [io, receiveMessage, roomId, setMessages, viewer]
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
