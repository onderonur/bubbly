import React, { useState, useCallback } from 'react';
import { Box, useTheme } from '@material-ui/core';
import Loading from './Loading';
import AspectRatio, { getAspectRatioString } from './AspectRatio';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { Maybe } from 'types';
import AbsoluteFill from './AbsoluteFill';
import styled from 'styled-components';

const ORIGINAL = 'original';
const DEFAULT_ALT = 'Not Loaded';
const DEFAULT_ASPECT_RATIO = getAspectRatioString(1, 1);

const StyledImage = styled.img<BaseImageProps>`
  width: 100%;
  height: 100%;
  object-fit: ${({ objectFit }) => objectFit};
`;

interface BaseImageProps {
  src: string;
  alt: string;
  aspectRatio?: string | false;
  objectFit?: CSSProperties['objectFit'];
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const BaseImage = React.memo<BaseImageProps>(function BaseImage({
  src,
  alt = DEFAULT_ALT,
  aspectRatio = ORIGINAL,
  objectFit = 'cover',
  onClick,
}) {
  const [imgHeight, setImgHeight] = useState<Maybe<number>>();
  const [imgWidth, setImgWidth] = useState<Maybe<number>>();
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const isOriginalAspectRatio = aspectRatio === ORIGINAL;

  const handleLoad = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (isOriginalAspectRatio) {
        const img = e.target;
        setImgHeight(img.naturalHeight);
        setImgWidth(img.naturalWidth);
      }

      setIsImgLoaded(true);
    },
    [isOriginalAspectRatio]
  );

  const theme = useTheme();

  const content = (
    <>
      <Box
        display="block"
        height="100%"
        bgcolor={theme.palette.background.default}
      >
        <StyledImage
          src={src}
          alt={alt}
          objectFit={objectFit}
          onLoad={handleLoad}
          onClick={onClick}
        />
      </Box>
      {!isImgLoaded && (
        <AbsoluteFill
          display="flex"
          alignItems="center"
          bgcolor={theme.palette.background.default}
        >
          <Loading loading />
        </AbsoluteFill>
      )}
    </>
  );

  if (aspectRatio) {
    return (
      <AspectRatio
        aspectRatio={
          isOriginalAspectRatio
            ? imgWidth && imgHeight
              ? getAspectRatioString(imgWidth, imgHeight)
              : DEFAULT_ASPECT_RATIO
            : aspectRatio
        }
      >
        {content}
      </AspectRatio>
    );
  }

  return (
    <Box position="relative" height="100%" width="100%">
      {content}
    </Box>
  );
});

export default BaseImage;
