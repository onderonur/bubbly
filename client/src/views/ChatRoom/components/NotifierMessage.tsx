import React from 'react';
import { ChatNotification } from '../types';
import styled, { css } from 'styled-components';
import { Typography } from '@material-ui/core';

const Root = styled(Typography)`
  ${({ theme }) => {
    return css`
      padding: ${theme.spacing(1)}px;
      border-radius: ${theme.shape.borderRadius}px;
      background-color: ${theme.palette.info.main};
      color: ${theme.palette.info.contrastText};
    `;
  }}
`;

interface ChatNotifierProps {
  notification: ChatNotification;
}

const ChatNotifier = React.memo<ChatNotifierProps>(function ChatNotifier({
  notification,
}) {
  return (
    <Root variant="caption" align="center">
      {notification.body}
    </Root>
  );
});

export default ChatNotifier;
