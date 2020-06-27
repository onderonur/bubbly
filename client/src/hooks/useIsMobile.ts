import { useTheme, useMediaQuery } from '@material-ui/core';

function useIsMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile;
}

export default useIsMobile;
