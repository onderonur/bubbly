import { BoxProps, Box } from '@material-ui/core';
import styled, { css } from 'styled-components';

interface StyleProps {
  spacing?: number;
  flexDirection?: BoxProps['flexDirection'];
}

const Stack = styled(Box)<StyleProps>`
  display: flex;
  & > *:not(:last-child) {
    ${({ flexDirection, theme, spacing }) => {
      const margin = `${theme.spacing(spacing || 0)}px`;
      switch (flexDirection) {
        case 'column':
          return css`
            margin-bottom: ${margin};
          `;
        default:
          return css`
            margin-right: ${margin};
          `;
      }
    }}
  }
`;

export default Stack;
