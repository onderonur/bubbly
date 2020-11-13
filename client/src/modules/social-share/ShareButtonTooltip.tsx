import React from 'react';
import { Tooltip, TooltipProps } from '@material-ui/core';

interface ShareButtonTooltipProps {
  name: string;
  children: TooltipProps['children'];
}

const ShareButtonTooltip = React.memo<ShareButtonTooltipProps>(
  function ShareButtonTooltip({ name, children }) {
    const title = `Share on ${name}`;
    return <Tooltip title={title}>{children}</Tooltip>;
  }
);

export default ShareButtonTooltip;
