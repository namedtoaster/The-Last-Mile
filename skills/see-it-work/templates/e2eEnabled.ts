/**
 * Copy to src/dev/e2eEnabled.ts. Says whether the test seam (the test-seed deep
 * link) exists in this build: on in development, and in a release build made with
 * EXPO_PUBLIC_E2E=1 so the smoke tier can drive it. A store build made without
 * the variable folds this to false. Never set the variable for a store upload.
 *
 * Keep the dot notation: Expo only inlines process.env.EXPO_PUBLIC_* written this way.
 */
export const E2E_ENABLED = __DEV__ || process.env.EXPO_PUBLIC_E2E === '1';
