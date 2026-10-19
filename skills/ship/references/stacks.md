# Stacks

How each stack keeps its version, builds a release and uploads it. Every command here
comes from the framework's own docs, read on the date in **Checked**. Commands drift
between versions: if one fails, open the source link and follow the current page, then
update this file.

Stacks not listed (Unity, Godot, others) still ship through the native iOS and Android
sections once they export a native project. Read the engine's own export docs first.

## Detect the stack

These are heuristics from experience, not from any framework's docs. Check in this order; the first match wins, and confirm by opening the project.

| Look for | Stack |
| --- | --- |
| `app.json` or `app.config.*` with an `expo` key, or `expo` in `package.json` | Expo |
| `react-native` in `package.json`, with `ios/` and `android/` folders | React Native |
| `pubspec.yaml` with a `flutter` section | Flutter |
| `capacitor.config.*` | Capacitor |
| a `.csproj` containing `<UseMaui>true</UseMaui>` | .NET MAUI |
| `composeApp/` or a Gradle module using the `kotlin("multiplatform")` plugin | Kotlin Multiplatform |
| an `.xcodeproj` or `.xcworkspace` and no matches above | Native iOS |
| `build.gradle(.kts)` with `com.android.application` and no matches above | Native Android |
| `package.json` with a web framework (Next.js, Vite, React, Vue, Svelte) and no native project | A web app; see the last section |

## The version and the build number

Every stack has two numbers. The **version** (1.2.0) is what people see in the store.
The **build number** (45) must go up on every upload, and both stores reject one they
have already seen.

| Stack | Version | Build number |
| --- | --- | --- |
| Expo | `version` in app config | `ios.buildNumber` and `android.versionCode` in app config, or managed by EAS when `eas.json` sets `cli.appVersionSource` to `remote` with `autoIncrement` (the recommended setup) |
| React Native | `CFBundleShortVersionString` in Xcode, `versionName` in `android/app/build.gradle` | `CFBundleVersion` in Xcode, `versionCode` in `android/app/build.gradle` |
| Flutter | `version: 1.2.0+45` in `pubspec.yaml`: the part before `+` | the part after `+`. `--build-name` and `--build-number` override both at build time |
| Capacitor | as native iOS and native Android, in `ios/` and `android/` | as native iOS and native Android |
| .NET MAUI | `<ApplicationDisplayVersion>` in the `.csproj` | `<ApplicationVersion>` in the `.csproj` |
| Native iOS | Marketing Version (`CFBundleShortVersionString`) | Current Project Version (`CFBundleVersion`) |
| Native Android | `versionName` in the app module's Gradle file | `versionCode` in the app module's Gradle file |

## Build and upload

| Stack | iOS release | Android release | Upload |
| --- | --- | --- | --- |
| Expo | `eas build --platform ios --profile production` (cloud; `--local` builds on your Mac) | `eas build --platform android --profile production` | `eas submit --platform ios` / `android`, or `--auto-submit` on the build. Runs on macOS, Linux and Windows. Android needs a Google service account key and, for the first submission, the app created in Play Console |
| React Native | Xcode: `Release` scheme, device set to "Any iOS Device (arm64)", Product, Archive | `npx react-native build-android --mode=release`; the bundle is at `android/app/build/outputs/bundle/release/app-release.aab` | Xcode Organizer for iOS; Play Console or fastlane for Android |
| Flutter | `flutter build ipa`; the `.ipa` lands in `build/ios/ipa` | `flutter build appbundle`; the bundle lands in `build/app/outputs/bundle/release/app.aab` | Apple's Transporter app, or `xcrun altool --upload-app --type ios -f build/ios/ipa/*.ipa --apiKey <key> --apiIssuer <issuer>`; Play Console or fastlane for Android |
| Capacitor | build the web app, `npx cap sync`, then as native iOS | build the web app, `npx cap sync`, then as native Android | as native iOS and native Android |
| .NET MAUI | `dotnet publish -f net8.0-ios -c Release -p:ArchiveOnBuild=true -p:RuntimeIdentifier=ios-arm64` with signing properties; needs a Mac, or a paired Mac from Windows | `dotnet publish -f net8.0-android -c Release` with keystore properties; produces AAB and APK, the signed AAB has `-signed` in its name | Transporter or Xcode for iOS; Play Console or fastlane for Android |
| Kotlin Multiplatform | as native iOS, from the iOS app project | as native Android | as native iOS and native Android |
| Native iOS | Xcode: Product, Archive, then Distribute App in the Organizer | | Xcode Organizer, Transporter, or fastlane. Apple lists Xcode, Swift Playground, altool and Transporter as upload tools |
| Native Android | | `./gradlew :app:bundleRelease` once signing is set up in the app module's Gradle file (the module may not be named `app`) | Play Console, fastlane, or the community Gradle Play Publisher plugin (unverified, no saved page) |

Replace `net8.0` with the .NET version the project targets.

Android's largest allowed `versionCode` is 2100000000.

**fastlane** works with every stack once there is a native build. `deliver` (also
called `upload_to_app_store`) uploads screenshots, previews, metadata and builds to
App Store Connect and can submit for review. `supply` (also called
`upload_to_play_store`) uploads metadata, screenshots and app bundles to Google Play,
picks the track and promotes builds. `supply` needs one build uploaded to Google Play by hand first. `deliver` runs on a Mac. Apple's privacy labels are not set by `deliver`; fastlane's docs point to a separate `upload_app_privacy_details_to_app_store` action.

## Signing, briefly

- **iOS:** a distribution certificate and an App Store provisioning profile. Xcode's
  automatic signing, EAS and fastlane `match` can manage both. Losing them is
  recoverable; revoke and recreate.
- **Android:** an upload key in a keystore file. Google Play App Signing keeps the key
  that signs what users install. A lost or leaked upload key can be reset in Play
  Console, which takes time, so back it up somewhere that is not the repo
  ([app signing](https://developer.android.com/studio/publish/app-signing)).

## Where to look during the rejection sweep

| What | Where |
| --- | --- |
| Android permissions | Android Studio's **Merged Manifest** tab, or the report at `<module>/build/outputs/logs/manifest-merger-<variant>-report.txt` after a release build. Expo and React Native: the `android/app` module. Flutter: `android/app`. MAUI: `Platforms/Android/AndroidManifest.xml` plus what packages add |
| iOS permission texts | `Info.plist` (Expo: `ios.infoPlist` in app config; MAUI: `Platforms/iOS/Info.plist`) |
| Text shipped to iOS | search the source, translation files and bundled content for other store names. For Flutter also `lib/` and `l10n/`; for web based stacks the built web folder |
| Privacy manifest | `PrivacyInfo.xcprivacy` in the iOS project |
| SDKs that send data | `package.json`, `pubspec.yaml`, `Podfile`, Gradle dependencies, `.csproj` package references |

## A web app (Lovable, Bolt, v0, Next.js and others)

The stores take native apps, so a web app needs a native shell first.

1. **Pick the shell.** Capacitor wraps the built web app in native iOS and Android
   projects and gives it native features through plugins. That is the default for both
   stores. For Google Play only, a Trusted Web Activity (built with Bubblewrap) opens
   the live site full screen; see the trap about the site vouching for the app.
2. **Capacitor needs** a `package.json`, a folder for the built web files (such as
   `dist` or `www`), and an `index.html` with a `<head>` tag in that folder. Then:
   `npm i @capacitor/core`, `npm i -D @capacitor/cli`, `npx cap init`,
   `npm i @capacitor/android @capacitor/ios`, `npx cap add android`, `npx cap add ios`, and after every web build, `npx cap sync`.
   Set `webDir` in the Capacitor config to the built web folder.
3. **Apps that need a server** (Next.js server rendering, API routes) do not run
   inside the shell as they are. Either export a static build and call the existing
   server for data, or point the shell at the live site, which makes the minimum
   functionality trap more likely.
4. **Earn the App Store.** Apple rejects apps that are a repackaged website (see the
   minimum functionality trap). Before the first submission, add something the
   website can't do: push notifications, offline use, the camera, widgets, or in-app
   purchases. Say what it is in the review notes.

## Sources

Checked 2026-10-12 by reading each project's official docs source on GitHub (the
files those sites are built from) or the page itself.

- Expo: [EAS Build setup](https://docs.expo.dev/build/setup/), [submit to the App Store](https://docs.expo.dev/submit/ios/), [submit to Google Play](https://docs.expo.dev/submit/android/), [app versions](https://docs.expo.dev/build-reference/app-versions/)
- React Native: [publishing to the App Store](https://reactnative.dev/docs/publishing-to-app-store), [publishing to Google Play](https://reactnative.dev/docs/signed-apk-android)
- Flutter: [build and release an iOS app](https://docs.flutter.dev/deployment/ios), [build and release an Android app](https://docs.flutter.dev/deployment/android)
- Capacitor: [installation](https://capacitorjs.com/docs/getting-started), [deploying to the App Store](https://capacitorjs.com/docs/ios/deploying-to-app-store), [deploying to Google Play](https://capacitorjs.com/docs/android/deploying-to-google-play)
- .NET MAUI: [publish an iOS app from the command line](https://learn.microsoft.com/dotnet/maui/ios/deployment/publish-cli), [publish an Android app from the command line](https://learn.microsoft.com/dotnet/maui/android/deployment/publish-cli)
- Android: [build from the command line](https://developer.android.com/build/building-cmdline), [manage manifest files](https://developer.android.com/build/manage-manifests), [Trusted Web Activities](https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities)
- fastlane: [deliver](https://docs.fastlane.tools/actions/deliver/), [supply](https://docs.fastlane.tools/actions/supply/)
- Apple: [upload builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds), [versioning](https://developer.android.com/studio/publish/versioning) for the Android versionCode limit. Checked 2026-10-19 (saved copies fetched 2026-10-12).
- Not checked against a page: the whole detect-the-stack table, the Kotlin Multiplatform hints, Xcode menu and label names beyond React Native's description of them, the Gradle Play Publisher plugin, and the MAUI manifest path. Confirm before relying on them.
