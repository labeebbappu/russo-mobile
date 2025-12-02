import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "./SplashScreen";
import Colors from "../theme/colors";
import { useMutation } from "@apollo/client/react";
import { Auth_Verification } from "../api/mutations";
import Constants from "expo-constants";

interface AuthVerificationResponse {
  authVerify: {
    role: string;
  };
}

const GatewayScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [auth, { loading, error }] =
    useMutation<AuthVerificationResponse>(Auth_Verification);
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  useEffect(() => {
    if (!showSplash) {
      const checkAuth = async () => {
        try {
          const data = await SecureStore.getItemAsync("userData");
          const token = data ? JSON.parse(data).userToken : null;
          console.log(token)
          if (token) {
            const { data } = await auth({
              variables: { appSecret: APP_SECRET, userToken: token },
            });
            if (data?.authVerify?.role === "app-user") {
              navigation.replace("AppUserHome", { user: data.authVerify });
            } else {
              navigation.replace("Home", { user: data.authVerify });
            }
          } else {
            navigation.replace("Login");
          }
        } catch (err) {
          navigation.replace("Login");
        }
      };
      checkAuth();
    }
  }, [showSplash]);

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
      <ActivityIndicator size="large" color={Colors.russoGreen} />
    </View>
  );
};
export default GatewayScreen;
