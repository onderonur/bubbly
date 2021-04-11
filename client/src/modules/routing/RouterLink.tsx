import React from 'react';
import { LinkProps, Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  text-decoration: none;
` as typeof Link;

const RouterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <StyledLink ref={ref} {...props} />;
  },
);

export default RouterLink;
