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

type AppTitleWithMenuTogglerProps = {
  hideTextOnMobile?: boolean;
  asLink?: boolean;
  onClickMenuButton: VoidFunction;
};

const AppTitleWithMenuToggler = React.memo<AppTitleWithMenuTogglerProps>(
  function AppTitleWithMenuToggler({
    hideTextOnMobile,
    asLink,
    onClickMenuButton,
  }) {
    const title = <AppTitle hideTextOnMobile={hideTextOnMobile} />;

    return (
      <Stack spacing={0.5} alignItems="center">
        <IsMobile>
          <IconButton onClick={onClickMenuButton}>
            <MenuIcon />
          </IconButton>
        </IsMobile>
        {asLink ? <TitleLink to="/">{title}</TitleLink> : title}
      </Stack>
    );
  }
);

export default AppTitleWithMenuToggler;
