import React, { useCallback } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import { IconButton } from '@material-ui/core';
import { saveAs } from 'file-saver';
import BaseImage from '@src/modules/shared/BaseImage';
import BaseDialog from '@src/modules/base-dialog/BaseDialog';
import BaseDialogTitle from '@src/modules/base-dialog/BaseDialogTitle';
import BaseDialogContent from '@src/modules/base-dialog/BaseDialogContent';

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
      [src],
    );

    return (
      <BaseDialog open={isOpen} fullScreen onClose={onClose}>
        <BaseDialogTitle
          extra={
            <IconButton onClick={handleDownload}>
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
  },
);

export default FullScreenImageViewer;
