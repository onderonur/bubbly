import React, { useState, useCallback } from 'react';
import { useSocketListener } from '@src/modules/socket-io/SocketIoContext';
import { Box, Typography } from '@material-ui/core';
import { getHelpingVerb } from '@src/modules/shared/SharedUtils';
import { ChatEvent } from '@shared/SocketIoEvents';
import { SocketUser } from '../shared/SharedTypes';

const TypingUsers = React.memo(function TypingUsers() {
  const [typingUsers, setTypingUsers] = useState<SocketUser[]>([]);

  const handleStartedTyping = useCallback(
    (actionType: 'started' | 'finished') => (user: SocketUser) => {
      switch (actionType) {
        case 'started':
          setTypingUsers((current) => [...current, user]);
          break;
        case 'finished':
          setTypingUsers((current) =>
            current.filter((typingUser) => typingUser.id !== user.id),
          );
          break;
      }
    },
    [],
  );

  useSocketListener(ChatEvent.STARTED_TYPING, handleStartedTyping('started'));
  useSocketListener(ChatEvent.FINISHED_TYPING, handleStartedTyping('finished'));

  return (
    <Box
      // Used "visibility" to prevent screen to jump up and down
      visibility={typingUsers.length ? 'visible' : 'hidden'}
      paddingY={0.5}
    >
      <Typography variant="caption">
        {typingUsers.map((user) => user.username).join(', ')}{' '}
        {getHelpingVerb(typingUsers.length)} typing...
      </Typography>
    </Box>
  );
});

export default TypingUsers;
