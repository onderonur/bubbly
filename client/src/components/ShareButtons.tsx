import React, { useMemo } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TumblrShareButton,
  TumblrIcon,
  MailruShareButton,
  MailruIcon,
} from 'react-share';
import ShareButtonTooltip from './ShareButtonTooltip';
import { Maybe } from 'types';
import Stack from 'components/Stack';

interface ShareButtonsProps {
  url: Maybe<string>;
}

const ShareButtons = React.memo<ShareButtonsProps>(function ShareButtons({
  url,
}) {
  const shareButtonProps = useMemo(
    () => ({
      url: url || '',
    }),
    [url]
  );

  const shareIconProps = useMemo(() => ({ size: 50, round: true }), []);

  if (!url) {
    return null;
  }

  return (
    <Stack spacing={2} flexWrap="wrap" justifyContent="center">
      <div>
        <ShareButtonTooltip name="Facebook">
          <FacebookShareButton {...shareButtonProps}>
            <FacebookIcon {...shareIconProps} />
          </FacebookShareButton>
        </ShareButtonTooltip>
      </div>
      <div>
        <ShareButtonTooltip name="Twitter">
          <TwitterShareButton {...shareButtonProps}>
            <TwitterIcon {...shareIconProps} />
          </TwitterShareButton>
        </ShareButtonTooltip>
      </div>
      <div>
        <ShareButtonTooltip name="Reddit">
          <RedditShareButton {...shareButtonProps}>
            <RedditIcon {...shareIconProps} />
          </RedditShareButton>
        </ShareButtonTooltip>
      </div>
      <div>
        <ShareButtonTooltip name="Tumblr">
          <TumblrShareButton {...shareButtonProps}>
            <TumblrIcon {...shareIconProps} />
          </TumblrShareButton>
        </ShareButtonTooltip>
      </div>
      <div>
        <ShareButtonTooltip name="Linkedin">
          <LinkedinShareButton {...shareButtonProps}>
            <LinkedinIcon {...shareIconProps} />
          </LinkedinShareButton>
        </ShareButtonTooltip>
      </div>
      <div>
        <ShareButtonTooltip name="Mail.Ru">
          <MailruShareButton {...shareButtonProps}>
            <MailruIcon {...shareIconProps} />
          </MailruShareButton>
        </ShareButtonTooltip>
      </div>
      <div>
        <EmailShareButton {...shareButtonProps}>
          <EmailIcon {...shareIconProps} />
        </EmailShareButton>
      </div>
    </Stack>
  );
});

export default ShareButtons;
