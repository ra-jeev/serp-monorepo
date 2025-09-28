import type { BreadcrumbItem } from '@nuxt/ui';

export function useBreadcrumbs(
  context?: MaybeRef<{
    companyName?: string;
    categoryName?: string;
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
    }

    return items;
  });

  return { breadcrumbs };
}
