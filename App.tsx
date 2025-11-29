import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ApolloProvider } from "@apollo/client/react";
import client from "./src/api/client";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
