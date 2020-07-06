import React from 'react';
import { LinkProps, Link } from 'react-router-dom';

const RouterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <Link ref={ref} {...props} />;
  }
);

export default RouterLink;
