import React from 'react';
import { DefaultSeo, DefaultSeoProps } from 'next-seo';
import { useRouter } from 'next/router';

const appTitle = process.env.NEXT_PUBLIC_APP_TITLE;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getDefaultSeoConfig = (pathname: string): DefaultSeoProps => {
  const url = `${baseUrl}${pathname}`;
  const description = `${appTitle} is a Full Stack chat application created w/ Next.js, Socket.IO, Express, React and TypeScript`;
  return {
    titleTemplate: `%s | ${appTitle}`,
    description,
    canonical: url,
    openGraph: {
      title: appTitle,
      description,
      type: 'website',
      locale: 'en_IE',
      url,
      site_name: appTitle,
      images: [
        { width: 192, height: 192, url: `${baseUrl}/bubbly-192.png` },
        { width: 512, height: 512, url: `${baseUrl}/bubbly-512.png` },
        { width: 688, height: 688, url: `${baseUrl}/bubbly-original.png` },
      ],
    },
    additionalMetaTags: [
      {
        property: 'dc:creator',
        content: 'Onur ÖNDER',
      },
      {
        name: 'application-name',
        content: appTitle,
      },
    ],
  };
};

function BaseDefaultSeo() {
  const router = useRouter();
  return <DefaultSeo {...getDefaultSeoConfig(router.asPath)} />;
}

export default BaseDefaultSeo;
