import React from 'react';
import { Typography, Container, Box } from '@material-ui/core';
import { Bold } from '@src/modules/shared/Text';
import BaseButton from '@src/modules/shared/BaseButton';
import { routes } from '@src/modules/routing/RoutingConstants';
import styled from 'styled-components';
import NextLink from './NextLink';

const Root = styled(Container)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NotFound404 = React.memo(function NotFound404() {
  return (
    <Root maxWidth="sm">
      <Typography variant="h1" align="center">
        <Bold>Oops</Bold>
      </Typography>
      <Typography variant="h4" align="center">
        <Bold>404 - PAGE NOT FOUND</Bold>
      </Typography>
      <Typography variant="body1" align="center">
        The page you are looking for might have been removed, had it&apos;s name
        changed or is temporarily unavailable
      </Typography>
      <Box display="flex" justifyContent="center" margin={1}>
        <BaseButton
          variant="contained"
          color="primary"
          component={NextLink}
          href={routes.home.path()}
        >
          Go to Homepage
        </BaseButton>
      </Box>
    </Root>
  );
});

export default NotFound404;
