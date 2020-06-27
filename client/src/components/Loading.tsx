import React from 'react';
import { CircularProgress, Box } from '@material-ui/core';

type LoadingProps = React.PropsWithChildren<{
  loading: boolean;
}>;

function Loading({ loading, children }: LoadingProps) {
  if (!loading) {
    return <>{children || null}</>;
  }

  return (
    <Box display="flex" justifyContent="center" my={2} flexGrow={1}>
      <CircularProgress size={48} color="secondary" />
    </Box>
  );
}

export default Loading;
