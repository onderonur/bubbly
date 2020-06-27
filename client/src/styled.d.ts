// https://styled-components.com/docs/api#create-a-declarations-file
// import original module declarations
import 'styled-components';
import { Theme } from '@material-ui/core';

// and extend them!
declare module 'styled-components' {
  interface DefaultTheme extends Theme {}
}
