import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "./SplashScreen";
import Colors from "../theme/colors";

const GatewayScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    if (!showSplash) {
      const checkAuth = async () => {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          navigation.replace("Home", { token });
        } else {
          navigation.replace("Login");
        }
      };
      checkAuth();
    }
  }, [showSplash, navigation]);

  if (showSplash) {
    return <SplashScreen onAnimationEnd={() => setShowSplash(false)} />;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.offWhite,
      }}
    >
      {/* <ActivityIndicator size="large" color={Colors.russoGreen} /> */}
    </View>
  );
};
export default GatewayScreen;
