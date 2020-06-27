import React from 'react';
import { Hidden } from '@material-ui/core';

type ExceptOnMobileProps = React.PropsWithChildren<{}>;

function ExceptOnMobile({ children }: ExceptOnMobileProps) {
  return <Hidden smDown>{children}</Hidden>;
}

export default ExceptOnMobile;
