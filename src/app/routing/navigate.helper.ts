import { inject } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

export function useNavigate() {
  const router = inject(Router);

  return {
    to: (route: any[], extras?: NavigationExtras) =>
      router.navigate(route, extras),

    relativeTo: (route: any[], relativeTo: ActivatedRoute, extras?: NavigationExtras) =>
      router.navigate(route, { ...extras, relativeTo }),
  };
}

export function navigateFromService(
  router: Router,
  route: any[],
  extras?: NavigationExtras,
) {
  return router.navigate(route, extras);
}
