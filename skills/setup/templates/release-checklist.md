# Release test checklist

What a human has to check on the **next** build. Nothing else belongs here.

**Last release: <none yet>.**

## How this works

- Sessions add items to **Pending** when they change something a person has to look
  at on a device: a screen, a layout, a purchase, a notification, a deep link, or
  anything that only behaves differently in a release build. Automated checks do
  not go here.
- Bumping the version moves Pending into **Verify on <version>** and drops the old
  block, so the list only ever covers one build.
- Tick an item as soon as it is verified, with the evidence in the item.
- Once that build ships, clear its block. A list describing a build already in the
  store wastes the next person's time.
- Never write an item no available device can satisfy.

## Verify on <version>

## Pending

- [ ] **<Surface>:** <steps to reach it and do it>. Expected: <result>. _(added <YYYY-MM-DD>)_
