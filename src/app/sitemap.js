export default async function sitemap() {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 1.0,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/bot`,
      lastModified: new Date(),
      changefreq: 'monthly',
      priority: 0.7,
    },
  ];
}
