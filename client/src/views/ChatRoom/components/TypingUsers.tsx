import React, { useState, useCallback } from 'react';
import { SocketUser } from 'types';
import { useSocketListener } from 'contexts/SocketContext';
import { Box, Typography } from '@material-ui/core';
import { getHelpingVerb } from 'utils';

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
            current.filter((typingUser) => typingUser.id !== user.id)
          );
          break;
      }
    },
    []
  );

  useSocketListener('started typing', handleStartedTyping('started'));
  useSocketListener('finished typing', handleStartedTyping('finished'));

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
