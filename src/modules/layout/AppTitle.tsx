import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Bold } from '@src/modules/shared/Text';
import Stack from '@src/modules/shared/Stack';
import AppLogo from '../app-logo/AppLogo';
import IsMobile from '@src/modules/is-mobile/IsMobile';

const StyledAppLogo = styled(AppLogo)`
  width: 50px;
`;

interface AppTitleProps {
  hideTextOnMobile?: boolean;
}

const AppTitle = React.memo<AppTitleProps>(function AppTitle({
  hideTextOnMobile,
}) {
  const title = (
    <Typography variant="h5">
      <Bold>{process.env.NEXT_PUBLIC_APP_TITLE}</Bold>
    </Typography>
  );

  return (
    <Stack spacing={1} alignItems="center">
      <StyledAppLogo quality="medium" />
      {hideTextOnMobile ? <IsMobile fallback={title}>{null}</IsMobile> : title}
    </Stack>
  );
});

export default AppTitle;
