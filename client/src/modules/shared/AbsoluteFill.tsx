import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

type AbsoluteFillProps = BoxProps;

function AbsoluteFill(props: AbsoluteFillProps) {
  return (
    <Box {...props} position="absolute" top={0} bottom={0} left={0} right={0} />
  );
}

export default AbsoluteFill;
