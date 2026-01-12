import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for dynamic meta tags and structured data
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords (comma-separated)
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.ogType - Open Graph type (default: 'website')
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogImageAlt - Open Graph image alt text
 * @param {Object} props.schema - Schema.org structured data object
 * @param {boolean} props.noindex - Whether to prevent indexing (default: false)
 */
const SEO = ({
  title = 'Israel Visa Application - Official Online Portal',
  description = 'Apply for your Israel visa online - Fast, secure, and hassle-free Israel visa application process. Get your visa in 3-5 business days with 24/7 support.',
  keywords = 'Israel visa, Israel visa application, Israel e-visa, visa application online, travel to Israel',
  canonical,
  ogType = 'website',
  ogImage = 'https://yourdomain.com/og-image.jpg',
  ogImageAlt = 'Israel Visa Application Portal',
  schema,
  noindex = false,
  children
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://yourdomain.com';
  const fullTitle = title.includes('Israel Visa') ? title : `${title} | Israel Visa Application`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  
  // Ensure title and description have common keywords
  const commonKeywords = ['Israel', 'visa', 'application'];
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  // Verify keyword alignment
  const hasKeywordAlignment = commonKeywords.some(keyword => 
    titleLower.includes(keyword) && descLower.includes(keyword)
  );
  
  if (!hasKeywordAlignment && process.env.NODE_ENV === 'development') {
    console.warn('SEO Warning: Title and description should share common keywords for better SEO');
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Israel Visa Application Portal" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@IsraelVisaApp" />
      <meta name="twitter:creator" content="@IsraelVisaApp" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Additional custom elements */}
      {children}
    </Helmet>
  );
};

export default SEO;

/**
 * Helper function to create BreadcrumbList schema
 */
export const createBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}${crumb.path}`
    }))
  };
};

/**
 * Helper function to create Service schema
 */
export const createServiceSchema = (serviceName, description, price) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Israel Visa Application Portal"
    },
    "areaServed": "Worldwide",
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
};

/**
 * Helper function to create Article schema for blog posts
 */
export const createArticleSchema = (article) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": article.author || "Israel Visa Portal Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Israel Visa Application Portal",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.REACT_APP_SITE_URL || 'https://yourdomain.com'}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
};

/**
 * Helper function to create FAQPage schema
 */
export const createFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
