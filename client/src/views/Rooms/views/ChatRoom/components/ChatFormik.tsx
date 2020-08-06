import React, { useCallback } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  removeSpaceAround,
  maxFileSizeInMB,
  validateFileType,
  validateFileSize,
} from 'utils';
import { ChatFormValues, ChatMessage } from '../types';
import { ID, OnSubmitFn } from 'types';
import useSocketIo from 'contexts/SocketIoContext';
import { useViewer } from 'contexts/ViewerContext';
import { nanoid } from 'nanoid';
import { useChatMessages } from '../contexts/ChatMessageContext';

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
      `Max size should be ${maxFileSizeInMB} MB`,
      (value: ChatFormValues['file']) => {
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
      (value: ChatFormValues['file']) => {
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
