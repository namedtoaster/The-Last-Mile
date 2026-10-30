# The rejection log

Every rejection the app gets is written down in one small file, so the same mistake
never costs the app twice, and so the lesson can be carried to the user's other apps.
The log lives in the project at `store/rejections/`, one JSON file per rejection.

## When an entry is written

- **On a rejection** (step 7): draft the entry from the reviewer's message and the fix,
  show it, and write it on the user's yes. One yes, no form.
- **When the fixed build is approved:** fill in `outcome`, `passedOn` and `daysLost`,
  and raise `verification` if you saw the approval yourself. Do this without asking;
  it only completes the entry the user already approved.
- **During the sweep** (step 1): read every entry and check that none of their causes
  has come back.

## File name

`store/rejections/<rejectedOn>-<store>-<guideline slug>.json`, for example
`2026-05-06-app_store-2.3.10.json`.

## Fields

| Field | Meaning |
| --- | --- |
| `store` | `app_store` or `google_play` |
| `guideline` | The guideline number and name, or the policy name on Google Play |
| `rejectedOn` | Date of the rejection, `YYYY-MM-DD` |
| `reviewerText` | The reviewer's words, with the app's name, package, people, ids and version numbers replaced by `[redacted]`. `null` if the user does not have it |
| `whatTriggered` | What in the app caused it, in plain words |
| `fix` | What changed |
| `outcome` | `pending` until the next review, then `passed` or `failed` |
| `passedOn` | Date the fixed build was approved, or `null` |
| `daysLost` | Days from `rejectedOn` to `passedOn` |
| `generalRule` | The lesson for any app, one sentence, with no project details |
| `app` | `{ "category": ..., "stack": ... }` only. Never the app's name |
| `verification` | `agent-seen` if an agent read the reviewer's message and later saw the approval in the console or the store's email; `reported` if it rests on the user's word or on history |

## Example

```json
{
  "store": "google_play",
  "guideline": "Photo and Video Permissions policy",
  "rejectedOn": "2026-05-16",
  "reviewerText": "Issue found: Permission use is not directly related to your app's core purpose. Your app only requires one-time or infrequent access to media files on the device. Version code [redacted]: In-app experience. Remove the use of READ_MEDIA_IMAGES/READ_MEDIA_VIDEO permission from all version codes within the submission. This includes both production and testing tracks.",
  "whatTriggered": "A media library package added READ_MEDIA_IMAGES and READ_MEDIA_VIDEO to the merged Android manifest.",
  "fix": "A config plugin strips the media permissions; photos come through the system photo picker. New build uploaded to every active track.",
  "outcome": "passed",
  "passedOn": "2026-05-21",
  "daysLost": 5,
  "generalRule": "Check the merged manifest of a release build for restricted permissions; libraries add them silently. Remove them from every track.",
  "app": { "category": "Health and fitness", "stack": "Expo, React Native" },
  "verification": "reported"
}
```

## Privacy

The log stays in the user's project. Nothing in it leaves the machine unless the user
chooses to share it. Because entries never hold the app's name, a `generalRule` that is
new to `references/traps.md` can go straight into the step 7 trap report.
