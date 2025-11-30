import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import GatewayScreen from "../screens/GatewayScreen";
import SignupScreen from "../screens/SignupScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import CustomHeader from "src/components/CustomHeader";
import OnboardingScreen from "src/screens/OnboardingScreen";
import AppUserHomeScreen from "src/screens/AppUserHomeScreen";
import UserAccounts from "src/screens/UserAccountsScreen";
import EditUserAccount from "src/screens/EditAccountScreen";

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
            header: (props) => <CustomHeader {...props} title="Home" />,
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
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            header: (props) => (
              <CustomHeader {...props} title="Customer Onboarding" />
            ),
          }}
        />
        <Stack.Screen
          name="AppUserHome"
          component={AppUserHomeScreen}
          options={{
            header: (props) => (
              <CustomHeader {...props} title="App User Home" />
            ),
          }}
        />
        <Stack.Screen
          name="UsersList"
          component={UserAccounts}
          options={{
            header: (props) => <CustomHeader {...props} title="Accounts" />,
          }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserAccount}
          options={{
            header: (props) => <CustomHeader {...props} title="Accounts" />,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default AppNavigator;
