import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

type ChatHeaderProps = React.PropsWithChildren<{
  justifyContent: BoxProps['justifyContent'];
}>;

function ChatHeader({ justifyContent, children }: ChatHeaderProps) {
  return (
    <Box display="flex" justifyContent={justifyContent} padding={0.5}>
      {children}
    </Box>
  );
}

export default ChatHeader;
