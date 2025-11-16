import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "./SplashScreen";
import Colors from "../theme/colors";
import { useMutation } from "@apollo/client/react";
import { Auth_Verification } from "../api/mutations";
import Constants from "expo-constants";

const GatewayScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [auth, { loading, error }] = useMutation(Auth_Verification);
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  useEffect(() => {
    if (!showSplash) {
      const checkAuth = async () => {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          const { data } = await auth({
            variables: {
              appSecret: APP_SECRET,
              userToken: token,
            },
          });
          console.log(data);
          if (data.authVerify.userId) {
            navigation.replace("Home", { user: data.authVerify });
          } else {
            navigation.replace("Login");
          }
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
      <ActivityIndicator size="large" color={Colors.russoGreen} />
    </View>
  );
};
export default GatewayScreen;
