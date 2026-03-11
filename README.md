# NearByte Mobile
Making File Sharing Easy. MacOS, Windows, IOS, Android

## System Overview

**Discovery** 
This uses mDNS `react-native-zeroconf` for discovering devices in the local network. 

`TODO : // Implement Cryptography`

**TCP Layer**
This establishes raw TCP connection `react-native-tcp-socket` between two devices.

**File Transfer**
This Supports Sending Small Files to Streaming Large Files.



-- **Note** : Exceptions's haven't been handled properly (Device Permissions to be exact)


## Stack

- **React Native** — cross-platform mobile library
- **Expo** - Heavily Relies on Expo SDK's
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