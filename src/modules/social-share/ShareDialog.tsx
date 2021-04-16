import React, { useState, useRef, useCallback } from 'react';
import BaseDialog from '@src/modules/base-dialog/BaseDialog';
import BaseDialogTitle from '@src/modules/base-dialog/BaseDialogTitle';
import BaseDialogContent from '@src/modules/base-dialog/BaseDialogContent';
import ShareButtons from './ShareButtons';
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Grid,
  Box,
  useTheme,
} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import CopyToClipboard from 'react-copy-to-clipboard';
import ShareLogo from './ShareLogo';
import Stack from '../shared/Stack';
import { isServer } from '../shared/SharedUtils';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: VoidFunction;
}

const ShareDialog = React.memo<ShareDialogProps>(function ShareDialog({
  isOpen,
  onClose,
}) {
  const [isCopied, setIsCopied] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  const handleCopy = useCallback(() => {
    setIsCopied(true);
    const timer = timerRef.current;
    if (timer) {
      clearTimeout(timer);
    }
    timerRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, []);

  const theme = useTheme();

  const href = isServer() ? undefined : window.location.href;

  if (!href) {
    return null;
  }

  return (
    <BaseDialog
      open={isOpen}
      scroll="body"
      fullWidth
      maxWidth="md"
      onClose={onClose}
    >
      <BaseDialogTitle>Invite Friends</BaseDialogTitle>
      <BaseDialogContent>
        <Grid container spacing={2}>
          <Box
            bgcolor={theme.palette.background.default}
            borderRadius={theme.shape.borderRadius}
            clone
          >
            <Grid item xs={12} sm={6} md={4}>
              <ShareLogo />
            </Grid>
          </Box>
          <Grid item xs={12} sm={6} md={8}>
            <Stack
              spacing={2}
              flexDirection="column"
              height="100%"
              justifyContent="center"
            >
              <TextField
                variant="outlined"
                value={href}
                disabled
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard text={href} onCopy={handleCopy}>
                        <Tooltip
                          open={isCopied}
                          title="Copied to clipboard!"
                          placement="top"
                        >
                          <IconButton>
                            <FileCopyOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </CopyToClipboard>
                    </InputAdornment>
                  ),
                }}
              />
              <ShareButtons url={href} />
            </Stack>
          </Grid>
        </Grid>
      </BaseDialogContent>
    </BaseDialog>
  );
});

export default ShareDialog;
