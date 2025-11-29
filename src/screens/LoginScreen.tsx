import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../theme/colors";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "../api/mutations";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

interface LoginResponse {
  authLogin: {
    userToken: string;
    createdAt: string;
    role: string;
  };
}

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] =
    useMutation<LoginResponse>(LOGIN_MUTATION);
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Please enter your email.");
      return;
    }
    if (!password) {
      Alert.alert("Please enter your password.");
      return;
    }

    try {
      const { data } = await login({
        variables: {
          appSecret: APP_SECRET,
          username: email,
          password: password,
        },
      });
      if (data.authLogin.role === "app-user") {
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(data.authLogin)
        );
        navigation.replace("AppUserHome", { user: data.authLogin });
      } else {
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(data.authLogin)
        );
        navigation.replace("Home", { user: data.authLogin });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.agreement}>
        This is done to ensure the security of your account. By clicking on the
        "Login" button, you are indicating your agreement with our{" "}
        <Text
          style={{ color: Colors.russoGreen, textDecorationLine: "underline" }}
          onPress={() => Linking.openURL("https://your-terms-url.com")}
        >
          terms and conditions.
        </Text>
      </Text>
      <TextInput
        style={[styles.input, { color: Colors.charcoal }]}
        placeholder="Email"
        placeholderTextColor={Colors.charcoal}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
        returnKeyType="next"
      />
      <View style={{ position: "relative" }}>
        <TextInput
          style={[styles.input, { color: Colors.charcoal }]}
          placeholder="Password"
          placeholderTextColor={Colors.charcoal}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          textContentType="password"
        />

        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons
            size={24}
            color={Colors.charcoal}
            name={showPassword ? "eye-off" : "eye"}
          />
        </TouchableOpacity>
      </View>
      {!!error && <Text style={styles.errorText}>{error.message}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLogin()}
        disabled={loading}
        accessibilityLabel="Login button"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.Secondarybutton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.secondaryButtonText}>Signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.offWhite,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: Colors.deepForest,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 8,
  },
  agreement: {
    color: Colors.charcoal,
    fontSize: 14,
    fontWeight: 500,
    paddingHorizontal: 21,
    textAlign: "center",
    marginBottom: 44,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.charcoal,
    padding: 12,
    backgroundColor: Colors.whiteSmoke,
    fontSize: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
    padding: 2,
  },
  button: {
    borderRadius: 8,
    backgroundColor: Colors.russoGreen,
    marginTop: 8,
    paddingVertical: 12,
  },
  Secondarybutton: {
    borderRadius: 8,
    backgroundColor: Colors.whiteSmoke,
    marginTop: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  primaryButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
    color: "white",
  },
  secondaryButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
    color: Colors.charcoal,
  },
  forgotPassword: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.russoGreen,
    fontWeight: 600,
    marginTop: 8,
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
  },
  link: {},
});
