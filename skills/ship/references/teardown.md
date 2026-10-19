# Teardown: compare every flow against shipped apps, at the level of single taps

A rejection sweep proves the app is allowed in the store. This proves it behaves like
an app people already trust. The bugs it catches are small and constant: a card that is
still there after you chose an option in its sheet, a feed that goes blank for your
heaviest user, the same item saved twice, a sheet that closes and leaves the screen
unchanged. Users rarely report these. They just leave.

Run it at the **Standard** level and above, after the release build works and before
the store listing, so the screenshots show the fixed screens.

## The one rule

Same as the reference-hunt skill: **only compare against a screen someone has actually
seen** (a Mobbin screen or flow opened this session, a screenshot from the user, a store
listing image). Never describe another app's behaviour from memory or a blog post.

## 1. List the app's flows

Read the routes and screens, then write one line per flow as a job, not a screen name:
"save a shared post", "act on a suggestion card", "pick between two options", "undo a
dismiss", "browse a library", "change a setting". Include every card, sheet and modal
that asks the user to choose something. Those are where most of these bugs live.

## 2. Pick the apps to compare against

For each flow, pick 3 to 5 shipped apps that do the same job, and at least one from a
different category (the best pattern is often elsewhere). Save the list in the
project's research folder as `teardown-apps.md`: flow, apps, why each was picked. The
next teardown reuses it rather than choosing again.

## 3. Watch what the reference apps do after each tap

Use Mobbin flows (search the job, not the screen name), then the user's screenshots,
then store listing images. For each step of each flow, write down what changes on
screen **after** the action. That "after" is the whole point:

- Where the action started: does the card, row or button that opened the sheet go
  away, change state ("Saved", a tick, greyed out) or move?
- What confirms it: a toast, a haptic, an inline change, nothing?
- Is there an undo, and for how long?
- What does going back show: the same scroll position, the updated item?

## 4. Walk the same flow in this app

On a real device or simulator, with realistic data (an empty account, a new account,
and a heavy account with everything saved). The see-it-work skill can capture each
step; screen-atlas gives the full map. Record the same "after" for every action.
Reading the code is not enough: these are state bugs that only show on screen.

## 5. The granular checks

Walk each of these for every flow. Each is a real bug that shipped somewhere.

| Check | Fails when |
| --- | --- |
| **The prompt resolves** | You choose an option in a sheet or modal opened from a card, the sheet closes, and the original card is still there unchanged. After any choice, the thing that asked must go away or show the new state. |
| **Every tap answers** | A tap gives no pressed state, haptic, toast or visible change within a moment. |
| **Undo for anything that removes or dismisses** | A dismiss, delete or "not for me" has no undo, or the undo restores the wrong thing. |
| **Back keeps your place** | Returning from a detail screen loses the scroll position or shows stale data. |
| **Counts agree everywhere** | A count or badge on one screen does not change after acting on another. |
| **No duplicates** | Saving, sharing or importing the same thing twice creates two copies. Match on what makes it the same (the link, an id), not on a new row id. |
| **Never blank for heavy users** | A feed or library that hides what the user already has goes empty for the account that has everything. Mark saved items instead of removing them, and say when there is nothing new. |
| **Dismissed stays dismissed** | A one-time card comes back after a tab switch or relaunch. See the one-time-surface skill. |
| **Empty, loading, error, offline** | A list has no empty state, spins forever offline, or shows a raw error. |
| **Double tap** | Tapping a submit or save twice quickly does it twice. |
| **Long text and large type** | A long title, a long name or the largest system text size cuts off a button or overlaps. |
| **Keyboard** | The keyboard covers the field being typed in or the button that submits it. |

## 6. Report, fix, prove

Write each difference as a finding: the flow, the step, what this app does, what the
reference app does (with its link), and effort (small, medium, large). Blockers first,
then the rest ranked by how many users hit them.

Fix the small ones now, one at a time, and prove each on screen with see-it-work.
Medium and large go to the backlog with the reference link. Add a checklist item for
each fix to `RELEASE_TEST_CHECKLIST.md` so the next release build is checked by hand.
Save the findings next to `teardown-apps.md` with the date.
