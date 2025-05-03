import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  pagePath?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = '${process.env.REACT_APP_NAME} | Free URL Shortener',
  description = 'Create short, memorable links with ${process.env.REACT_APP_NAME} free URL shortener. Perfect for social media sharing, marketing campaigns, and simplifying long URLs.',
  canonical = '${process.env.REACT_APP_DOMAIN}/',
  pagePath = '',
}) => {
  const pageUrl = `${process.env.REACT_APP_DOMAIN}${pagePath}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;