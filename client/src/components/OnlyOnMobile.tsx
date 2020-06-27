import React from 'react';
import { Hidden } from '@material-ui/core';

type OnlyOnMobileProps = React.PropsWithChildren<{}>;

function OnlyOnMobile({ children }: OnlyOnMobileProps) {
  return <Hidden mdUp>{children}</Hidden>;
}

export default OnlyOnMobile;
