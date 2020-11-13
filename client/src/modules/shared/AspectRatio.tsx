import React from 'react';
import styled, { css } from 'styled-components';

// Instead of using "${number}:${number}" when setting aspectRatio prop, use this function.
// Aspect ratio string format may change in the future, so we would just change this function
// to make it happen.
export function getAspectRatioString(width: number, height: number) {
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new Error('Invalid aspect ratio');
  }
  return `${width}:${height}`;
}

type AspectRatioProps = React.PropsWithChildren<{
  aspectRatio: string;
}>;

const AspectRatio = styled.div<AspectRatioProps>`
  ${({ aspectRatio }) => {
    let paddingTop;
    if (aspectRatio) {
      const [ratioX, ratioY] = aspectRatio
        .split(':')
        .map((ratio) => parseInt(ratio));
      const ratio = (100 * ratioY) / ratioX;
      paddingTop = isNaN(ratio) ? undefined : `${ratio}%`;
    }

    return css`
      position: relative;
      overflow: hidden;
      height: ${paddingTop ? '0px' : '100%'};
      padding-top: ${paddingTop};
      & > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }}
`;

export default AspectRatio;
