import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { ChatMessage, ChatNotification } from '../types';
import { Box } from '@material-ui/core';
import ScrollBar, { ScrollbarProps } from 'react-scrollbars-custom';
import styled from 'styled-components';
import useChatNotifications from '../hooks/useChatNotifications';
import MessageListItem from './MessageListItem';
import { ScrollState } from 'react-scrollbars-custom/dist/types/types';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Zoom from '@material-ui/core/Zoom';
import usePrevious from 'hooks/usePrevious';

const BOTTOM_SCROLL_THRESHOLD = 150;

const BackToBottomFab = styled(Fab)`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)}px;
  bottom: ${({ theme }) => theme.spacing(2)}px;
`;

const StyledScrollBar = styled(ScrollBar)`
  background-color: ${({ theme }) => theme.palette.background.default};
`;

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList = React.memo<MessageListProps>(function MessageList({
  messages,
}) {
  const scrollBarRef = useRef<ScrollBar>(null);

  const notifications = useChatNotifications();

  const fullList: (ChatMessage | ChatNotification)[] = useMemo(
    () =>
      [...messages, ...notifications].sort((a, b) => a.timestamp - b.timestamp),
    [messages, notifications]
  );

  const [isBackToBottomVisible, setIsBackToBottomVisible] = useState(false);

  useEffect(() => {
    // If the scroll position is far from bottom to show the
    // "back to bottom" button, we don't automatically
    // scroll to bottom when there are new messages.
    // TODO: Will show some badge etc to notify user about new messages.
    if (!isBackToBottomVisible && prevFullList !== fullList) {
      scrollBarRef.current?.scrollToBottom();
    }
  }, [
    fullList,
    isBackToBottomVisible,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    prevFullList,
  ]);

  var prevFullList = usePrevious(fullList);

  const scrollBarWrapperProps = useMemo<ScrollbarProps['wrapperProps']>(
    () => ({
      renderer: (props) => {
        const { elementRef, children, ...rest } = props;

        function handleClick() {
          scrollBarRef.current?.scrollToBottom();
        }

        return (
          <div {...rest} ref={elementRef}>
            {children}
            <Zoom in={isBackToBottomVisible}>
              <BackToBottomFab
                size="small"
                color="secondary"
                onClick={handleClick}
              >
                <KeyboardArrowDownIcon />
              </BackToBottomFab>
            </Zoom>
          </div>
        );
      },
    }),
    [isBackToBottomVisible]
  );

  const handleScroll = useCallback<NonNullable<ScrollbarProps['onScroll']>>(
    ((scrollState: ScrollState) => {
      const { scrollHeight, scrollTop, clientHeight } = scrollState;
      let diff = scrollHeight - (scrollTop + clientHeight);
      diff = Math.round(diff);
      const threshold = BOTTOM_SCROLL_THRESHOLD;
      setIsBackToBottomVisible(diff >= threshold);
    }) as never,
    []
  );

  return (
    <StyledScrollBar
      ref={scrollBarRef}
      onScroll={handleScroll}
      wrapperProps={scrollBarWrapperProps}
    >
      <Box padding={1} clone>
        <ul>
          {fullList.map((listItem) => {
            return <MessageListItem key={listItem.id} listItem={listItem} />;
          })}
        </ul>
      </Box>
    </StyledScrollBar>
  );
});

export default MessageList;
