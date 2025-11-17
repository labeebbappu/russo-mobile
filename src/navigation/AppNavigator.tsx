import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import GatewayScreen from "../screens/GatewayScreen";
import SignupScreen from "../screens/SignupScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent={true}
      />
      <Stack.Navigator id={undefined} initialRouteName="Gateway">
        <Stack.Screen
          name="Gateway"
          component={GatewayScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPasswordScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
