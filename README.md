# NearByte Mobile
Making File Sharing Easy. MacOS, Windows, IOS, Android

## System Overview

**Discovery** :

Uses mDNS protocol for discovering devices in the local network. 

*`TODO : // Implement Cryptography`*

------

**TCP Layer** :

Establishes a transport layer between two devices

------

**File Transfer** :

Allows Sending Small Files to Streaming Large Files over raw TCP Network


## Stack

- **React Native** — cross-platform mobile library
- **Expo** - Heavily Relies on Expo's SDKs
- **react-native-zeroconf** — mDNS publish & scan
- **react-native-tcp-socket** — raw TCP server/client
- **Zustand** — shared state across screens
- **NativeWind** — Tailwind styling

## Getting started


This app requires native builds. as some libraries used aren't compatible with Expo Go.

```sh
npm install
npx expo prebuild # create prebuild for both android and ios
npx expo run:android   # or run:ios
```



***Note**** : *Exceptions aren't handled properly (Device Permissions to be exact)*