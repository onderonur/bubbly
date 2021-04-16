import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { ChatMessage, ChatNotification } from './ChatTypes';
import { Box } from '@material-ui/core';
import ScrollBar, { ScrollbarProps } from 'react-scrollbars-custom';
import styled from 'styled-components';
import useChatNotifications from './useChatNotifications';
import ChatItemListItem from './ChatItemListItem';
import { ScrollState } from 'react-scrollbars-custom/dist/types/types';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Zoom from '@material-ui/core/Zoom';
import usePrevious from '@src/modules/shared/usePrevious';
import { ID } from '@shared/SharedTypes';
import { useChatMessages } from './ChatMessageContext';

const bottomScrollThreshold = 150;

const BackToBottomFab = styled(Fab)`
  position: absolute;
  right: ${({ theme }) => theme.spacing(2)}px;
  bottom: ${({ theme }) => theme.spacing(2)}px;
`;

const StyledScrollBar = styled(ScrollBar)`
  background-color: ${({ theme }) => theme.palette.background.default};
`;

interface ChatItemListProps {
  roomId: ID;
}

const ChatItemList = React.memo<ChatItemListProps>(function ChatItemList({
  roomId,
}) {
  const scrollBarRef = useRef<ScrollBar>(null);

  const { messages } = useChatMessages();
  const notifications = useChatNotifications(roomId);

  const fullList: (ChatMessage | ChatNotification)[] = useMemo(
    () =>
      [...messages, ...notifications].sort((a, b) => a.timestamp - b.timestamp),
    [messages, notifications],
  );

  const [isBackToBottomVisible, setIsBackToBottomVisible] = useState(false);

  useEffect(() => {
    // If the scroll position is far from bottom to show the
    // "back to bottom" button, we don't automatically
    // scroll to bottom when there are new messages.
    // TODO: Will show some badge etc to notify user about new messages.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!isBackToBottomVisible && prevFullList !== fullList) {
      scrollBarRef.current?.scrollToBottom();
    }
  }, [
    fullList,
    isBackToBottomVisible,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    prevFullList,
  ]);

  // eslint-disable-next-line no-var
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
    [isBackToBottomVisible],
  );

  const handleScroll = useCallback((scrollState: ScrollState) => {
    const { scrollHeight, scrollTop, clientHeight } = scrollState;
    let diff = scrollHeight - (scrollTop + clientHeight);
    diff = Math.round(diff);
    const threshold = bottomScrollThreshold;
    setIsBackToBottomVisible(diff >= threshold);
  }, []);

  return (
    <StyledScrollBar
      ref={scrollBarRef}
      onScroll={handleScroll as never}
      wrapperProps={scrollBarWrapperProps}
    >
      <Box padding={1} clone>
        <ul>
          {fullList.map((listItem) => {
            return <ChatItemListItem key={listItem.id} listItem={listItem} />;
          })}
        </ul>
      </Box>
    </StyledScrollBar>
  );
});

export default ChatItemList;
