# Material Colors for Mac

A handy little Mac app that gives you quick access to the standard material design color palette.

<img src="art/screenshot.png" width="320" alt="Screenshot">

**[Download the app](https://github.com/romannurik/MaterialColorsApp/releases/latest)**

## Build instructions

If you want to customize the app for your own needs, you can do a custom build.

  1. First install [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/).
  2. Clone the repository and in the root directory, run:
     ```
     $ yarn install
     ```
  3. To run the app:
     ```
     $ yarn start
     ```

## Packaging a local macOS arm64 .app (Apple Silicon)

To produce a local Apple Silicon `.app` (and a `.dmg`):

```
$ CSC_IDENTITY_AUTO_DISCOVERY=false yarn dist:mac:arm64
```

This will create an **arm64** app bundle under `dist/mac-arm64/` (and also a zip and dmg in `dist/`).

## Installing from releases

Since this app was not signed with an Apple Developer ID, run this in terminal after installation:

```
xattr -dr com.apple.quarantine "/Applications/Material Colors.app"
```

## Auto-updates

This fork has the original Roman Nurik auto-update feed **disabled**.
