import React, { useCallback } from 'react';
import { Formik, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { trimString } from 'utils';
import { ChatFormValues, ChatMessage } from '../types';
import { ID } from 'types';
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
    .transform(trimString),
  // TODO: Will fix this and add some validations for files
  file: Yup.mixed(),
});

type OnSubmit = FormikConfig<ChatFormValues>['onSubmit'];

export type ChatFormikProps = React.PropsWithChildren<{
  roomId: ID;
}>;

function ChatFormik({ roomId, children }: ChatFormikProps) {
  const { setMessages, receiveMessage } = useChatMessages();

  const io = useSocketIo();
  const viewer = useViewer();

  const handleSubmit = useCallback<OnSubmit>(
    (values, formikHelpers) => {
      if (!viewer) {
        return;
      }
      const { body, file } = values;
      const tempMessage: ChatMessage = {
        id: nanoid(),
        body: body ? trimString(body) : null,
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
