export default defineAppConfig({
  site: {
    name: 'SERP',
    url: 'serp.co',
    footerColumns: [
      {
        label: 'Software',
        children: [
          { label: 'Products', to: '/products/' },
          { label: 'Categories', to: '/products/best/' },
          { label: 'Cloud GPUs', to: '/products/best/cloud-gpu-providers/' },
        ],
      },
      {
        label: 'Resources',
        children: [
          { label: 'Blog', to: '/blog/' },
          { label: 'Glossary', to: '/glossary/' },
        ],
      },
    ],
    socialLinks: [
      {
        name: 'Twitter',
        href: 'https://serp.ly/@serpai/twitter',
        icon: 'i-simple-icons-x',
      },
      {
        name: 'Facebook',
        href: 'https://serp.ly/@serpai/facebook',
        icon: 'i-simple-icons-facebook',
      },
      {
        name: 'LinkedIn',
        href: 'https://serp.ly/@serpai/linkedin',
        icon: 'i-simple-icons-linkedin',
      },
      {
        name: 'YouTube',
        href: 'https://serp.ly/@serpai/youtube',
        icon: 'i-simple-icons-youtube',
      },
      {
        name: 'Github',
        href: 'https://serp.ly/@serpai/github',
        icon: 'i-simple-icons-github',
      },
      {
        name: 'Instagram',
        href: 'https://serp.ly/@serpai/instagram',
        icon: 'i-simple-icons-instagram',
      },
    ],
    legalLinks: [
      { label: 'About', to: '/about/' },
      { label: 'Privacy', to: '/legal/privacy-policy/' },
      { label: 'Terms', to: '/legal/terms-conditions/' },
      { label: 'Affiliate Disclosure', to: '/legal/affiliate-disclosure/' },
      { label: 'DMCA', to: '/legal/dmca/' },
    ],
    headerNavItems: [
      { label: 'Companies', to: '/products/' },
      { label: 'Categories', to: '/products/best/' },
      { label: 'Blog', to: '/blog/' },
      { label: 'Glossary', to: '/glossary/' },
    ],
  },
});
