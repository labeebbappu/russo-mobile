require("dotenv").config();

module.exports = {
  expo: {
    name: "Russo",
    slug: "russo-mobile",
    owner: "mohamedsuhail065",
    projectId: "5cc9266f-9dc4-486b-8e3c-82f8e181e0e8",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FAF9F7",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mohamedsuhail065.russomobile",
    },
    android: {
      package: "com.mohamedsuhail065.russomobile",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: ["expo-secure-store"],
    extra: {
      GRAPHQL_URL: process.env.GRAPHQL_URL,
      APP_SECRET: process.env.APP_SECRET,
      ADMIN_APP_ID: process.env.ADMIN_APP_ID,
      eas: {
        projectId: "5cc9266f-9dc4-486b-8e3c-82f8e181e0e8",
      },
    },
  },
};
