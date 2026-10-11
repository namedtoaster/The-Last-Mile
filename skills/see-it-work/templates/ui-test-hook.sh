#!/usr/bin/env bash
# Copy to scripts/ui-test-hook.sh and chmod +x. Claude Code runs it after every
# Edit or Write (see hook-settings.jsonc). For a screen or component file it runs
# the component test that imports it; if none exists it tells Claude to write one
# first. For route files it also runs the smoke coverage check. Exit 2 shows the
# message to Claude. Anything else is a silent no-op. Edit the paths below.
set -uo pipefail

ROUTES_DIR="app"                       # expo-router routes (src/app in some projects)
COMPONENTS_DIR="src/components"
TESTS_DIR="src/__tests__/screens"      # where component tests live
TEST_CMD="npx jest --silent --bail"    # add --config if UI tests use their own

cd "${CLAUDE_PROJECT_DIR:-}" 2>/dev/null || cd "$(dirname "$0")/.." || exit 0

# The hook payload arrives as JSON on stdin; pull out the edited file path.
file_path="$(cat | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
[ -z "$file_path" ] && exit 0
rel="${file_path#"$PWD"/}"

case "$rel" in *.ts|*.tsx) ;; *) exit 0 ;; esac
case "$rel" in "$ROUTES_DIR"/*|"$COMPONENTS_DIR"/*|"$TESTS_DIR"/*) ;; *) exit 0 ;; esac
# Layouts and the deep link handler are not screens.
case "$rel" in */_layout.tsx|*+native-intent*) exit 0 ;; esac

# A route file changed: every screen must still have a smoke case.
case "$rel" in
  "$ROUTES_DIR"/*)
    if ! cov="$(node scripts/check-e2e-coverage.mjs 2>&1)"; then
      { echo "Smoke coverage check failed after editing $rel."; echo "$cov"; } >&2
      exit 2
    fi ;;
esac

# Find the test(s) that import this file.
mod="${rel%.tsx}"; mod="${mod%.ts}"
case "$rel" in
  "$TESTS_DIR"/*)       tests="$rel" ;;
  "$COMPONENTS_DIR"/*)  tests="$(grep -rlF "${mod#src/}" "$TESTS_DIR" 2>/dev/null)" ;;
  *)                    tests="$(grep -rlF "$mod" "$TESTS_DIR" 2>/dev/null)" ;;
esac

if [ -z "${tests:-}" ]; then
  { echo "No component test covers $rel. Write it before finishing this change:"
    echo "  1. Create $TESTS_DIR/<name>.test.tsx that imports $rel."
    echo "  2. Assert full strings with getByText, presses, the navigation destination,"
    echo "     and the loading, empty, success and error branches."
    echo "  3. Watch it fail, then make it pass. Editing the test re-runs it through this hook."
    echo "Layout is not covered by component tests. Look at a screenshot for that."; } >&2
  exit 2
fi

out="$($TEST_CMD $tests 2>&1)" || {
  { echo "Component tests failed after editing $rel. Fix before continuing."
    echo "Ran: $(echo $tests)"; echo "$out" | tail -40; } >&2
  exit 2
}
exit 0
