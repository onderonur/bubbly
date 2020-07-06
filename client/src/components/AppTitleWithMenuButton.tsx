import React from 'react';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import Stack from './Stack';
import IsMobile from './IsMobile';
import AppTitle from './AppTitle';
import MenuIcon from '@material-ui/icons/Menu';
import RouterLink from './RouterLink';

const TitleLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
` as typeof RouterLink;

type AppTitleWithMenuButtonProps = {
  hideTextOnMobile?: boolean;
  asLink?: boolean;
  onClickMenuButton: VoidFunction;
};

const AppTitleWithMenuButton = React.memo<AppTitleWithMenuButtonProps>(
  function AppTitleWithMenuButton({
    hideTextOnMobile,
    asLink,
    onClickMenuButton,
  }) {
    const title = <AppTitle hideTextOnMobile={hideTextOnMobile} />;

    return (
      <Stack spacing={1} alignItems="center">
        <IsMobile>
          <IconButton size="small" onClick={onClickMenuButton}>
            <MenuIcon />
          </IconButton>
        </IsMobile>
        {asLink ? <TitleLink to="/">{title}</TitleLink> : title}
      </Stack>
    );
  }
);

export default AppTitleWithMenuButton;
