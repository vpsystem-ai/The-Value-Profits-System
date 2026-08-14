import React from 'react';

export default function SEO({
  title = "Value Betting System | Lær Value Betting & Tjen Penge på Sportsbetting",
  description = "Lær value betting med dokumenteret strategi. 1800+ medlemmer, +EV fokus, komplet kursus og community. Penge-tilbage garanti. Start din profitable betting-rejse i dag.",
  canonical = "https://valueprofitssystem.dk/",
  image = "https://valueprofitssystem.dk/og-image.png",
  type = "website",
  schema = null
}) {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="da_DK" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </>
  );
}
