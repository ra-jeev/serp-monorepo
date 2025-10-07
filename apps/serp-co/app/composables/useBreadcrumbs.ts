import type { BreadcrumbItem } from '@nuxt/ui';

export function useBreadcrumbs(
  context?: MaybeRef<{
    companyName?: string;
    categoryName?: string;
    postName?: string;
  }>,
) {
  const route = useRoute();

  const breadcrumbs = computed((): BreadcrumbItem[] => {
    const contextValue = unref(context);

    const items: BreadcrumbItem[] = [
      { label: 'Home', to: '/', icon: 'i-lucide-home' },
    ];

    const pathSegments = route.path.split('/').filter(Boolean);

    if (pathSegments[0] === 'products') {
      items.push({
        label: 'Products',
        to: '/products',
        icon: 'i-lucide-package',
      });

      if (pathSegments[1] === 'best') {
        items.push({
          label: 'Best Products',
          to: '/products/best',
          icon: 'i-lucide-star',
        });

        if (pathSegments[2]) {
          const categoryLabel =
            contextValue?.categoryName || 'Category Details';
          items.push({ label: categoryLabel, icon: 'i-lucide-tag' });
        }
      } else if (pathSegments[1] && pathSegments[2] === 'reviews') {
        const companyLabel = contextValue?.companyName || 'Company Details';
        items.push({ label: companyLabel, icon: 'i-lucide-building-2' });
      }
    } else if (pathSegments[0] === 'blog') {
      items.push({
        label: 'Blog',
        to: '/blog',
        icon: 'i-lucide-file-text',
      });

      if (pathSegments[1]) {
        const postLabel = contextValue?.postName || 'Article';
        items.push({ label: postLabel, icon: 'i-lucide-file-text' });
      }
    } else if (pathSegments[0] === 'glossary') {
      items.push({
        label: 'Glossary',
        to: '/glossary',
        icon: 'i-lucide-book-open',
      });

      if (pathSegments[1]) {
        const termLabel = contextValue?.postName || 'Term';
        items.push({ label: termLabel, icon: 'i-lucide-book-open' });
      }
    }

    return items;
  });

  return { breadcrumbs };
}
