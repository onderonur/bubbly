import React, { useCallback, useState, useEffect } from 'react';
import BaseImage from 'components/BaseImage';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import { getAspectRatioString } from 'components/AspectRatio';
import FullScreenImageViewer from './FullScreenImageViewer';

const Root = styled.div`
  cursor: pointer;
`;

interface ImageViewerProps {
  src: string;
  alt: string;
}

const MessageImage = React.memo<ImageViewerProps>(function MessageImage({
  src,
  alt,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [src]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  return (
    <>
      <Root onClick={toggleIsOpen}>
        <Box flex={1} height={0}>
          <BaseImage
            src={src}
            alt={alt}
            objectFit="cover"
            aspectRatio={getAspectRatioString(1, 1)}
          />
        </Box>
      </Root>
      <FullScreenImageViewer
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={toggleIsOpen}
      />
    </>
  );
});

export default MessageImage;
