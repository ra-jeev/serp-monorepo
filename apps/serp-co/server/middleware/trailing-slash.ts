export default defineEventHandler((event) => {
  const path = event.node.req.url || '';

  const [pathname, query] = path.split('?');
  if (
    pathname.startsWith('/_nuxt/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.endsWith('/') ||
    pathname === ''
  ) {
    return;
  }

  console.log('pathname: ', pathname);
  const newPath = pathname + '/' + (query ? `?${query}` : '');

  console.log('Added a redirect from oldPath: ', path, 'to: ', newPath);
  return sendRedirect(event, newPath, 301);
});
