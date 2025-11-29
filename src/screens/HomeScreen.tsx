import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../theme/colors";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { Auth_Verification } from "../api/mutations";
import Constants from "expo-constants";
const HomeScreen = ({ route, navigation }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const user = route.params?.user;
  // const handleLogout = async () => {
  //   await SecureStore.deleteItemAsync("userToken");
  //   await SecureStore.deleteItemAsync("createdAt");
  //   navigation.replace("Login");
  // };
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  const [auth, { loading, error }] = useMutation(Auth_Verification);
  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      const { data } = await auth({
        variables: {
          appSecret: APP_SECRET,
          userToken: token,
        },
      });
      console.log("Triggered");
    }
  };
  useEffect(() => {
    if (user?.createdAt) {
      const createdMs = new Date(user.createdAt).getTime();
      const nowMs = Date.now();
      const elapsedMs = nowMs - createdMs;
      const remainderMs = 600000 - (elapsedMs % 600000);
      const firstTimeout = setTimeout(() => {
        checkAuth();
        intervalRef.current = setInterval(checkAuth, 600000);
      }, remainderMs);
      return () => {
        clearTimeout(firstTimeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [user?.createdAt]);
  return (
    <View style={styles.container}>
      <Text>Welcome, {user?.fullName} </Text>
      <Text>Role:{user?.role}</Text>
      <Text>userId:{user?.userId}</Text>
      <Text>username:{user?.username}</Text>
      <Text>is New Token:{user?.isNewToken === false ? "false" : "true"}</Text>
      <Text>Token generated:{user?.userToken ? "true" : "false"}</Text>
      <Text>
        Created at:
        {new Date(user?.createdAt).toLocaleString("default", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text>
        Expiry At:
        {new Date(user?.expiryAt).toLocaleString("default", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <View style={styles.onBoardDiv}>
        <Text style={styles.heading}>Hop Aboard!</Text>
        <Text style={styles.content}>
          To make things work smoothly for you, we just need a quick hello (your
          contact info) and the essentials for your account!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Onboarding", {
              email: user?.username,
              fullName: user?.fullName,
            })
          }
        >
          <Text style={styles.buttonText}>Start Onboarding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.offWhite,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoutButton: {
    marginTop: 44,
    alignItems: "center",
    backgroundColor: Colors.russoGreen,
    padding: 10,
  },
  primaryButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
    color: "white",
  },
  onBoardDiv: {
    alignItems: "center",
    marginTop: 44,
    backgroundColor: Colors.mintGreen,
    padding: 12,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.charcoal,
  },
  content: {
    textAlign: "center",
    color: Colors.charcoal,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.russoGreen,
    padding: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
