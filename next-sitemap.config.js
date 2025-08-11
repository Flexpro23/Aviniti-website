/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.aviniti.app',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Increase priority for key pages
    const highPriority = ['/', '/estimate', '/contact', '/blog']
    return {
      loc: path,
      changefreq: 'weekly',
      priority: highPriority.includes(path) ? 0.9 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}


