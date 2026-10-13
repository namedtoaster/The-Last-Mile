# The full rulebooks

`traps.md` lists what has actually caught apps. This file points at the rules
themselves, so the rejection sweep can check an app against every section instead of
only the ones someone happened to get caught by.

The weekly snapshot job saves a text copy of each page below (see the fact-check
skill for how to read one when the live page is blocked). Read the saved copy, note
its fetched date, and cite the guideline number or policy name for every finding.

## Apple

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/):
  the whole rulebook, one page, numbered sections 1 Safety, 2 Performance,
  3 Business, 4 Design, 5 Legal.

## Google Play

- [Developer Program Policy](https://support.google.com/googleplay/android-developer/answer/17190352):
  the whole policy on one page (the version effective 15 July 2026 when this was
  written; Google replaces the page with a new address when the policy changes, so if
  the saved copy is old or missing, find the current one from the Policy Center).
- [Policy Center](https://play.google/developer-content-policy/): the index of every
  policy topic.
- [Health Content and Services](https://support.google.com/googleplay/android-developer/answer/16679511):
  medical claims, health apps declaration, disclaimers. Read it for any app that
  touches pregnancy, babies, fitness, food, sleep or mental health.

## How to sweep with them

1. Read each section's headings and decide, in one line each, whether it applies to
   this app. Write the list down; a section skipped silently is the one that bites.
2. For each section that applies, read it in full and check the app against it: the
   code, the bundled text and content, the store listing, and what a reviewer sees in
   the first minute.
3. Content counts as much as code. Bundled tips, sample posts, onboarding copy and
   notification text are all read by the reviewer. Anything that reads as medical,
   financial or legal advice gets the stricter sections.
4. Report each finding with the guideline number (Apple) or policy name (Google), the
   quoted rule from the saved copy, the file and line, and the saved copy's date.
5. A finding that rests on judgment ("could be read as medical advice") is reported as
   a risk with the reason, not as a certain rejection.
