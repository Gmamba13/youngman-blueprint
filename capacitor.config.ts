import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.youngmanblueprint.app",
  appName: "YoungmanBlueprint",
  webDir: "out",
  ios: {
    contentInset: "automatic",
    backgroundColor: "#F7F7F7",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#F7F7F7",
      iosSpinnerStyle: "small",
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
    StatusBar: {
      style: "Light",
      backgroundColor: "#F7F7F7",
    },
  },
};

export default config;
