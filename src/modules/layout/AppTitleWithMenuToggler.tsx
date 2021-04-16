import React from 'react';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import Stack from '@src/modules/shared/Stack';
import IsMobile from '@src/modules/is-mobile/IsMobile';
import AppTitle from './AppTitle';
import MenuIcon from '@material-ui/icons/Menu';
import { routes } from '@src/modules/routing/RoutingConstants';
import NextLink from '../routing/NextLink';

const TitleLink = styled(NextLink)`
  color: inherit;
  text-decoration: none;
`;

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
          <TitleLink href={routes.home.path()}>{title}</TitleLink>
        ) : (
          title
        )}
      </Stack>
    );
  },
);

export default AppTitleWithMenuToggler;
