import React, { useMemo } from 'react';
import { ChatMessage } from './ChatTypes';
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  Link,
  darken,
  useTheme,
} from '@material-ui/core';
import { useViewer } from 'modules/viewer/ViewerContext';
import Stack from 'modules/shared/Stack';
import ScheduleIcon from '@material-ui/icons/Schedule';
import DoneIcon from '@material-ui/icons/Done';
import MessageImage from './MessageImage';
import styled, { CSSProperties } from 'styled-components';
import Linkify from 'react-linkify';
import { Bold } from 'modules/shared/Text';
import useIsMobile from 'modules/is-mobile/useIsMobile';
import { dateTimeFormats, formatDateTime } from 'modules/shared/SharedUtils';

const maxWidth = '70%';
const minWidthWithImage = '50%';
const minWidthWithImageOnMobile = maxWidth;

interface BubbleStyleProps {
  $bgColor: NonNullable<CSSProperties['backgroundColor']>;
}

const Bubble = styled(Paper)<BubbleStyleProps>`
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ theme, $bgColor }) => theme.palette.getContrastText($bgColor)};
  padding: ${({ theme }) => theme.spacing(1)}px;
`;

interface MessageLinkProps {
  // https://styled-components.com/docs/api#transient-props
  // By putting a "$" as a prefix on a props,
  // we ensure that it won't be passed to the underlying
  // React node or rendered to the DOM element.
  $fontColor: string;
}

const MessageLink = styled(Link)<MessageLinkProps>`
  color: ${({ $fontColor }) => $fontColor};
`;

const MessageBody = styled(Typography)`
  white-space: pre-wrap;
  word-break: break-word;
`;

const MessageInfo = styled(Stack)`
  opacity: 0.6;
`;

interface MessageProps {
  message: ChatMessage;
}

const Message = React.memo<MessageProps>(function Message({ message }) {
  const { viewer } = useViewer();
  const isOwnMessage = message.author.id === viewer?.id;

  const imageUrl = useMemo(() => {
    const { file } = message;
    if (!file) {
      return;
    }
    const arrayBufferView = new Uint8Array(file as ArrayBuffer);
    const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
  }, [message]);

  const StatusIcon = message.isTemporary ? ScheduleIcon : DoneIcon;

  const imageTitle = `Image Sent by ${message.author.username}`;

  const theme = useTheme();
  const fontColor = theme.palette.getContrastText(message.author.color);
  const linkColor = darken(fontColor, 0.15);

  const isMobile = useIsMobile();

  return (
    <Box
      minWidth={
        imageUrl
          ? isMobile
            ? minWidthWithImageOnMobile
            : minWidthWithImage
          : undefined
      }
      maxWidth={maxWidth}
    >
      <Bubble $bgColor={message.author.color}>
        {!isOwnMessage && (
          <Typography variant="body2" noWrap>
            <Bold>{message.author.username}</Bold>
          </Typography>
        )}
        {imageUrl && (
          <Box marginBottom={1}>
            <MessageImage src={imageUrl} alt={imageTitle} />
          </Box>
        )}
        <Linkify
          componentDecorator={(href, text, key) => (
            <MessageLink
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              $fontColor={linkColor}
            >
              <Bold>{text}</Bold>
            </MessageLink>
          )}
        >
          <MessageBody variant="body2">{message.body}</MessageBody>
        </Linkify>
      </Bubble>
      <MessageInfo spacing={0.5} justifyContent="flex-end" alignItems="center">
        <Tooltip
          title={formatDateTime(message.timestamp, dateTimeFormats.dateTime)}
        >
          <Typography variant="caption">
            {formatDateTime(message.timestamp, dateTimeFormats.time)}
          </Typography>
        </Tooltip>
        {isOwnMessage && <StatusIcon fontSize="inherit" />}
      </MessageInfo>
    </Box>
  );
});

export default Message;
