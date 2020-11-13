import React from 'react';
import { Typography, Container, Box } from '@material-ui/core';
import { Bold } from 'modules/shared/Text';
import BaseButton from 'modules/shared/BaseButton';
import RouterLink from './RouterLink';
import { routes } from 'modules/routing/RoutingConstants';
import styled from 'styled-components';

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
        The page you are looking for might have been removed, had it's name
        changed or is temporarily unavailable
      </Typography>
      <Box display="flex" justifyContent="center" margin={1}>
        <RouterLink to={routes.home.path()}>
          <BaseButton variant="contained" color="primary">
            Go to Homepage
          </BaseButton>
        </RouterLink>
      </Box>
    </Root>
  );
});

export default NotFound404;
