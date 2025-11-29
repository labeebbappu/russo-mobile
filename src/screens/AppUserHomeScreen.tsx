import { Text, Touchable, TouchableOpacity, View } from "react-native";
import BottomNavigation from "src/components/BottomNavigation";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

const AppUserHomeScreen = ({ navigation }) => {
  return (
    <>
      <View>
        <Text>App User</Text>
      </View>
      <BottomNavigation />
    </>
  );
};
export default AppUserHomeScreen;
