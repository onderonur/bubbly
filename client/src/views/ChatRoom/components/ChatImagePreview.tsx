import React, { useMemo, useCallback } from 'react';
import { useTheme, Grow, IconButton, Box } from '@material-ui/core';
import BaseImage from 'components/BaseImage';
import AbsoluteFill from 'components/AbsoluteFill';
import CloseIcon from '@material-ui/icons/Close';
import ConversationHeader from './ConversationHeader';
import { useFormikContext } from 'formik';
import { ChatFormValues } from '../types';

interface ChatImagePreviewProps {
  name: string;
}

const ChatImagePreview = React.memo<ChatImagePreviewProps>(
  function ChatImagePreview({ name }) {
    const theme = useTheme();

    const { values, setFieldValue } = useFormikContext<ChatFormValues>();
    const { file } = values;

    const imageUrl = useMemo(() => {
      if (!file) {
        return;
      }
      return URL.createObjectURL(file);
    }, [file]);

    const handleClose = useCallback(() => {
      setFieldValue(name, null);
    }, [name, setFieldValue]);

    return (
      <Grow in={!!imageUrl}>
        <AbsoluteFill
          display="flex"
          flexDirection="column"
          zIndex={theme.zIndex.modal}
          bgcolor={theme.palette.background.paper}
        >
          <ConversationHeader justifyContent="flex-end">
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </ConversationHeader>
          {imageUrl && (
            <Box flex={1} height={0}>
              <BaseImage
                src={imageUrl}
                alt="Picked image"
                objectFit="contain"
                aspectRatio={false}
              />
            </Box>
          )}
        </AbsoluteFill>
      </Grow>
    );
  }
);

export default ChatImagePreview;
