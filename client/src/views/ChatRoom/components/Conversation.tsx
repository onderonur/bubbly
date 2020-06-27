import React, { useCallback } from 'react';
import useSocketIo from 'contexts/SocketContext';
import { ChatMessage } from '../types';
import ChatForm from './ChatForm';
import { ID } from 'types';
import MessageList from './MessageList';
import { Box } from '@material-ui/core';
import TypingUsers from './TypingUsers';
import { nanoid } from 'nanoid';
import RoomUserCounter from './RoomUserCounter';
import { useViewer } from 'contexts/ViewerContext';
import { trimString } from 'utils';
import ImagePicker from './ImagePicker';
import ConversationHeader from './ConversationHeader';
import ChatImagePreview from './ChatImagePreview';
import useConversation from '../hooks/useConversation';
import ChatFormik, { ChatFormikProps } from './ChatFormik';

interface ConversationProps {
  roomId: ID;
  onClickRoomUserCounter?: VoidFunction;
}

const Conversation = React.memo<ConversationProps>(function Conversation({
  roomId,
  onClickRoomUserCounter,
}) {
  const { messages, setMessages, receiveMessage } = useConversation();

  const io = useSocketIo();
  const viewer = useViewer();

  const handleSubmit = useCallback<ChatFormikProps['onSubmit']>(
    (values) => {
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
    },
    [io, receiveMessage, roomId, setMessages, viewer]
  );

  return (
    <ChatFormik onSubmit={handleSubmit}>
      <Box flex={1} height="100%" display="flex" flexDirection="column">
        <Box flex={1} display="flex" flexDirection="column" position="relative">
          <ConversationHeader justifyContent="space-between">
            <RoomUserCounter onClick={onClickRoomUserCounter} />
            <ImagePicker name="file" />
          </ConversationHeader>
          <MessageList messages={messages} />
          <ChatImagePreview name="file" />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <TypingUsers />
        </Box>
        <ChatForm roomId={roomId} />
      </Box>
    </ChatFormik>
  );
});

export default Conversation;
