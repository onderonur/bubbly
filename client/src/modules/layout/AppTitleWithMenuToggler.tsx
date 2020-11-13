import React from 'react';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import Stack from 'modules/shared/Stack';
import IsMobile from 'modules/is-mobile/IsMobile';
import AppTitle from './AppTitle';
import MenuIcon from '@material-ui/icons/Menu';
import RouterLink from 'modules/routing/RouterLink';
import { routes } from 'modules/routing/RoutingConstants';

const TitleLink = styled(RouterLink)`
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
        {asLink ? (
          <TitleLink to={routes.home.path()}>{title}</TitleLink>
        ) : (
          title
        )}
      </Stack>
    );
  }
);

export default AppTitleWithMenuToggler;
