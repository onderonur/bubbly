import {
  createMuiTheme,
  responsiveFontSizes,
  PaletteType,
} from '@material-ui/core';

const validThemeTypes: PaletteType[] = ['light', 'dark'];

function isValidThemeType(themeType: string): themeType is PaletteType {
  return validThemeTypes.includes(themeType as PaletteType);
}

function getTheme(type: PaletteType) {
  let selectedType = type;
  if (!isValidThemeType(type)) {
    selectedType = 'light';
  }
  let theme = createMuiTheme({
    palette: {
      type: selectedType,
      primary: {
        main: '#4e63d7',
      },
    },
  });

  theme = responsiveFontSizes(theme);

  return theme;
}

export default getTheme;
