/**
 * Copy to src/dev/testSeed.ts. Seeds a known app state and jumps to a screen, so
 * screenshots and smoke cases skip onboarding. Reached only through the test-seed
 * deep link, and only when E2E_ENABLED is true.
 *
 * Fill in the three TODO parts with your own stores. Keep it idempotent: running
 * it twice must not pile up duplicate data.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { E2E_ENABLED } from './e2eEnabled';
// One file that lists every one time moment key (celebrations, review ask,
// coach marks, permission primers), so a new key is silenced here automatically.
import { FIRST_RUN_SHOWN_KEYS, FIRST_RUN_PENDING_KEYS } from '../constants/firstRunKeys';

/** Named states. Each id maps to the route it lands on. Add variants as needed. */
const SCREENS: Record<string, string> = {
  home: '/',
  'home-empty': '/',
  settings: '/settings',
  paywall: '/paywall',
};

/** Variants whose whole point is showing a one time moment. They opt out of silencing. */
const SHOWCASE: string[] = [];

export async function seedTestState(screen = 'home', route?: string): Promise<void> {
  if (!E2E_ENABLED) return;

  // TODO 1: a signed in, onboarded user, so no wizard or redirect fires.
  // TODO 2: sample data for the screen ('home-empty' seeds none).
  if (screen !== 'home-empty') {
    // await useItemsStore.getState().loadSampleItems();
  }

  if (!SHOWCASE.includes(screen)) await silenceFirstRunMoments();

  // An explicit route wins, so the smoke manifest can add a screen without editing this file.
  const target = route ? resolveRouteTokens(route) : (SCREENS[screen] ?? '/');
  router.replace(target as never);
}

/** Mark every one time moment as already handled, so nothing covers the screen. */
async function silenceFirstRunMoments(): Promise<void> {
  await AsyncStorage.multiRemove(FIRST_RUN_PENDING_KEYS);
  await AsyncStorage.multiSet(FIRST_RUN_SHOWN_KEYS.map((k) => [k, 'true'] as [string, string]));
}

/** Swap tokens like {firstItemId} for a real seeded id. Unknown tokens stay, so the case fails visibly. */
function resolveRouteTokens(route: string): string {
  // TODO 3: if (route.includes('{firstItemId}')) { const id = ...; if (id) route = route.replace('{firstItemId}', id); }
  return route;
}
