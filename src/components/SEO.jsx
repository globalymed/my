import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noindex = false,
  nofollow = false
}) => {
  const siteName = "MedYatra - AI-Powered Medical Tourism in India";
  const siteUrl = "https://medyatra.space";
  const defaultImage = `${siteUrl}/logo.webp`;
  
  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || "Find top clinics for Hair, IVF, Dental, and Cosmetic treatments in India. AI-powered recommendations, travel assistance, and appointment booking.";
  const metaKeywords = keywords || "medical tourism, India, hair transplant, IVF, dental treatment, cosmetic surgery, healthcare, medical travel, clinic booking";
  const metaCanonical = canonical || siteUrl;
  const metaOgTitle = ogTitle || title || siteName;
  const metaOgDescription = ogDescription || description || metaDescription;
  const metaOgImage = ogImage || defaultImage;
  const metaOgUrl = ogUrl || metaCanonical;
  const metaTwitterCard = twitterCard || "summary_large_image";
  const metaTwitterTitle = twitterTitle || metaOgTitle;
  const metaTwitterDescription = twitterDescription || metaOgDescription;
  const metaTwitterImage = twitterImage || metaOgImage;

  const robotsContent = [];
  if (noindex) robotsContent.push('noindex');
  if (nofollow) robotsContent.push('nofollow');
  if (!noindex && !nofollow) robotsContent.push('index', 'follow');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={robotsContent.join(', ')} />
      <link rel="canonical" href={metaCanonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:url" content={metaOgUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={metaTwitterCard} />
      <meta name="twitter:title" content={metaTwitterTitle} />
      <meta name="twitter:description" content={metaTwitterDescription} />
      <meta name="twitter:image" content={metaTwitterImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="author" content="MedYatra" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

