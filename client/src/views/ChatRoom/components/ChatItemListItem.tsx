import React from 'react';
import { ChatMessage, ChatNotification, ChatItem } from '../types';
import { Box } from '@material-ui/core';
import Message from './Message';
import { useViewer } from 'contexts/ViewerContext';
import { isOfType } from 'utils';
import ChatNotifier from './ChatNotifier';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

type ChatItemListItemContainerProps = React.PropsWithChildren<{
  justifyContent: CSSProperties['justifyContent'];
}>;

function ChatItemListItemContainer({
  justifyContent,
  children,
}: ChatItemListItemContainerProps) {
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

interface ChatItemListItemProps {
  listItem: ChatItem;
}

const ChatItemListItem = React.memo<ChatItemListItemProps>(
  function ChatItemListItem({ listItem }) {
    const viewer = useViewer();

    const isMessage = isOfType<ChatMessage>(listItem, ['author']);

    if (isMessage) {
      const message = listItem as ChatMessage;
      const isOwnMessage = message.author.id === viewer?.id;
      return (
        <ChatItemListItemContainer
          justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
        >
          <Message message={message} />
        </ChatItemListItemContainer>
      );
    }

    const notification = listItem as ChatNotification;
    return (
      <ChatItemListItemContainer justifyContent="center">
        <ChatNotifier notification={notification} />
      </ChatItemListItemContainer>
    );
  }
);

export default ChatItemListItem;
