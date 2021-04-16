import React from 'react';
import ChatForm from './ChatForm';
import { ID } from '@shared/SharedTypes';
import ChatItemList from './ChatItemList';
import { Box, Typography } from '@material-ui/core';
import TypingUsers from './TypingUsers';
import RoomUserCounter from '../room-users/RoomUserCounter';
import ImagePicker from './ImagePicker';
import ChatHeader from './ChatHeader';
import ChatImagePreview from './ChatImagePreview';
import ChatFormik from './ChatFormik';
import Stack from '@src/modules/shared/Stack';
import { Bold } from '@src/modules/shared/Text';
import { useTopics } from '@src/modules/topics/TopicsContext';
import BaseSeo from '../seo/BaseSeo';

interface ChatProps {
  roomId: ID;
  onClickRoomUserCounter?: VoidFunction;
}

const Chat = React.memo<ChatProps>(function Chat({
  roomId,
  onClickRoomUserCounter,
}) {
  const topics = useTopics();
  const foundTopic = topics?.find((topic) => topic.roomId === roomId);

  return (
    <>
      <BaseSeo title={foundTopic?.title ?? 'Chat'} />
      <ChatFormik roomId={roomId}>
        <Box flex={1} height="100%" display="flex" flexDirection="column">
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            position="relative"
          >
            <ChatHeader justifyContent="space-between">
              <Stack spacing={2} alignItems="center">
                <RoomUserCounter onClick={onClickRoomUserCounter} />
                {foundTopic && (
                  <Typography variant="h6" color="textSecondary" noWrap>
                    <Bold>{foundTopic.title}</Bold>
                  </Typography>
                )}
              </Stack>
              <ImagePicker name="file" />
            </ChatHeader>
            <ChatItemList roomId={roomId} />
            <ChatImagePreview name="file" />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <TypingUsers />
          </Box>
          <ChatForm roomId={roomId} />
        </Box>
      </ChatFormik>
    </>
  );
});

export default Chat;
