import React from 'react';
import { ChatMessage, ChatNotification } from '../types';
import { Box } from '@material-ui/core';
import Message from './Message';
import { useViewer } from 'contexts/ViewerContext';
import { isOfType } from 'utils';
import NotifierMessage from './NotifierMessage';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

type MessageListItemWrapperProps = React.PropsWithChildren<{
  justifyContent: CSSProperties['justifyContent'];
}>;

function MessageListItemWrapper({
  justifyContent,
  children,
}: MessageListItemWrapperProps) {
  return (
    <Box
      paddingY={0.5}
      display="flex"
      justifyContent={justifyContent}
      component="li"
    >
      {children}
    </Box>
  );
}

export type ChatItem = ChatMessage | ChatNotification;

interface MessageListItemProps {
  listItem: ChatItem;
}

const MessageListItem = React.memo<MessageListItemProps>(
  function MessageListItem({ listItem }) {
    const viewer = useViewer();

    const isMessage = isOfType<ChatMessage>(listItem, ['author']);

    if (isMessage) {
      const message = listItem as ChatMessage;
      const isOwnMessage = message.author.id === viewer?.id;
      return (
        <MessageListItemWrapper
          key={listItem.id}
          justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
        >
          <Message message={message} />
        </MessageListItemWrapper>
      );
    }

    const notification = listItem as ChatNotification;
    return (
      <MessageListItemWrapper key={listItem.id} justifyContent="center">
        <NotifierMessage notification={notification} />
      </MessageListItemWrapper>
    );
  }
);

export default MessageListItem;
