import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'nearbyte',
  slug: 'nearbyte',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/nearbyte.png',
  scheme: 'nearbyte',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
    bundleIdentifier: 'com.bishwash007.nearbyte',
    infoPlist: {
      NSBonjourServices: ['_nearbyte._tcp'],
      NSLocalNetworkUsageDescription:
        'NearByte uses local network to find nearby devices.',
    },
    entitlements: {
      'com.apple.developer.networking.multicast': true,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
      foregroundImage: './assets/images/nearbyte.png',
      backgroundImage: './assets/images/nearbyte.png',
      monochromeImage: './assets/images/nearbyte.png',
    },
    permissions: [
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.CHANGE_WIFI_MULTICAST_STATE',
      'android.permission.INTERNET',
    ],
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.bishwash007.nearbyte',
  },
  web: {
    output: 'static',
    bundler: 'metro',
    favicon: './assets/images/nearbyte.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/nearbyte.png',
        imageWidth: 100,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-font',
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
        faceIDPermission:
          'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone',
        recordAudioAndroid: true,
        barcodeScannerEnabled: true,
      },
    ],
    [
      'expo-file-system',
      {
        supportsOpeningDocumentsInPlace: true,
        enableFileSharing: true,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share them with your friends.',
        colors: {
          cropToolbarColor: '#000000',
        },
        dark: {
          colors: {
            cropToolbarColor: '#000000',
          },
        },
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: '35.0.0',
        },
        ios: {
          deploymentTarget: '15.1',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
