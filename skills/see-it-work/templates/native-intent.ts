/**
 * Copy into your routes folder as +native-intent.ts (or merge into the existing
 * one). Catches <your-scheme>://test-seed?screen=<id> or ?route=<path> before the
 * router sees it, starts the seeding, and lands on '/' while the seeder navigates.
 * Only active when E2E_ENABLED is true. Fix the import paths for your project.
 */
import { E2E_ENABLED } from '../src/dev/e2eEnabled';

export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    if (E2E_ENABLED && path.includes('test-seed')) {
      const screen = /[?&]screen=([^&]+)/.exec(path)?.[1] ?? 'home';
      const rawRoute = /[?&]route=([^&]+)/.exec(path)?.[1];
      const route = rawRoute ? decodeURIComponent(rawRoute) : undefined;
      void import('../src/dev/testSeed').then(({ seedTestState }) => seedTestState(screen, route));
      return '/';
    }
    return path;
  } catch {
    return path;
  }
}
