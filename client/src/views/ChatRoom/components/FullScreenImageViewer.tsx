import React, { useCallback } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { IconButton } from '@material-ui/core';
import { saveAs } from 'file-saver';
import BaseImage from 'components/BaseImage';
import BaseDialog from 'components/BaseDialog';
import BaseDialogTitle from 'components/BaseDialogTitle';
import BaseDialogContent from 'components/BaseDialogContent';

interface FullScreenImageViewerProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: VoidFunction;
}

const FullScreenImageViewer = React.memo<FullScreenImageViewerProps>(
  function FullScreenImageViewer({ src, alt, isOpen, onClose }) {
    const handleDownload = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // To prevent clicking the download button to toggle zoom.
        e.stopPropagation();
        saveAs(src);
      },
      [src]
    );

    return (
      <BaseDialog open={isOpen} fullScreen onClose={onClose}>
        <BaseDialogTitle
          extra={
            <IconButton size="small" onClick={handleDownload}>
              <GetAppIcon />
            </IconButton>
          }
        >
          {alt}
        </BaseDialogTitle>
        <BaseDialogContent>
          <BaseImage
            src={src}
            alt={alt}
            aspectRatio={false}
            objectFit="contain"
          />
        </BaseDialogContent>
      </BaseDialog>
    );
  }
);

export default FullScreenImageViewer;
