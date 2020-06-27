import React from 'react';

type AppLogoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  quality: 'original' | 'large' | 'medium';
};

const IMAGE_SUFFIXES = {
  original: 'original',
  large: '512',
  medium: '192',
};

const AppLogo = React.memo<AppLogoProps>(function AppLogo({
  quality,
  ...rest
}) {
  return (
    <img
      {...rest}
      src={`/bubbly-${IMAGE_SUFFIXES[quality]}.png`}
      alt="Bubbly Logo"
    />
  );
});

export default AppLogo;
