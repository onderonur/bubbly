import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

type ConversationHeaderProps = React.PropsWithChildren<{
  justifyContent: BoxProps['justifyContent'];
}>;

function ConversationHeader({
  justifyContent,
  children,
}: ConversationHeaderProps) {
  return (
    <Box display="flex" justifyContent={justifyContent} padding={0.5}>
      {children}
    </Box>
  );
}

export default ConversationHeader;
