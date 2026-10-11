/**
 * Copy to e2e/smoke/manifest.mjs. Every screen in the app, how to reach it, and
 * what must be visible. The smoke runner drives one case per entry, and
 * check-e2e-coverage.mjs fails when a route file has no entry here.
 *
 * Fields:
 *   id        the screen's root carries testID={`screen-${id}`}
 *   file      the route file, checked by the coverage check
 *   route     path handed to the seeder (tokens like {firstItemId} resolved on device)
 *   seed      a named variant from testSeed.ts instead of a route
 *   skip      a reason; reported as skipped, never as passed
 *   platforms ['ios'] or ['android'] for a platform only screen
 */
export const SMOKE_CASES = [
  { id: 'home', file: 'app/index.tsx', seed: 'home' },
  { id: 'settings', file: 'app/settings.tsx', route: '/settings' },
  { id: 'item', file: 'app/item/[id].tsx', route: '/item/{firstItemId}' },
  { id: 'camera', file: 'app/camera.tsx', route: '/camera', skip: 'no camera on a simulator; check on a device' },
];

/** Route files that are not screens. Each needs a reason. */
export const NOT_SCREENS = {
  'app/_layout.tsx': 'navigator, not a screen',
  'app/+native-intent.ts': 'deep link handler, not a screen',
};
