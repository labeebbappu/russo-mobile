import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../theme/colors";
import * as SecureStore from "expo-secure-store";
const HomeScreen = ({ route, navigation }) => {
  const user = route.params?.user;
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    navigation.replace("Login");
  };
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
      <TouchableOpacity
        onPress={() => handleLogout()}
        style={styles.logoutButton}
      >
        <Text style={styles.primaryButtonText}>Logout</Text>
      </TouchableOpacity>
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
});
