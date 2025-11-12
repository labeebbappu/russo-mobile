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
      <TouchableOpacity onPress={() => handleLogout()}>
        <Text>Logout</Text>
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
});
