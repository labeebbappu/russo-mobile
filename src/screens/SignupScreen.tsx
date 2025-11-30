import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import Colors from "../theme/colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@apollo/client/react";
import { Register_Mutation } from "../api/mutations";
import Constants from "expo-constants";

interface RegistrationResponse {
  registrationCreate: {
    id: string;
  };
}

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswod] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  const [signup, { loading, error }] =
    useMutation<RegistrationResponse>(Register_Mutation);
  const hanldeSignup = async () => {
    const registrationInput = {
      fullName: fullName,
      password: password,
      primaryEmail: email,
    };
    setLocalError("");
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    try {
      const { data } = await signup({
        variables: {
          appSecret: APP_SECRET,
          registrationInput: registrationInput,
        },
      });
      if (data.registrationCreate.id) {
        navigation.navigate("Verification", { primaryEmail: email });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.offWhite }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Signup</Text>
        <Text style={styles.agreement}>
          This is done to ensure the security of your account. By clicking on
          the "Signup" button, you are indicating your agreement with our{" "}
          <Text
            style={{
              color: Colors.russoGreen,
              textDecorationLine: "underline",
            }}
            onPress={() => Linking.openURL("https://your-terms-url.com")}
          >
            terms and conditions.
          </Text>
        </Text>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholderTextColor={Colors.charcoal}
          autoCapitalize="words"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.charcoal}
        />
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={Colors.charcoal}
            secureTextEntry={!showPassword}
            style={[styles.input, { color: Colors.charcoal }]}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={Colors.charcoal}
            />
          </TouchableOpacity>
        </View>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPasswod}
            placeholderTextColor={Colors.charcoal}
            secureTextEntry={!showConfirmPassword}
            style={[styles.input, { color: Colors.charcoal }]}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color={Colors.charcoal}
            />
          </TouchableOpacity>
        </View>
        {!!localError && <Text style={styles.errorText}>{localError}</Text>}
        {!!error && <Text style={styles.errorText}>{error.message}</Text>}
        <TouchableOpacity style={styles.button} onPress={() => hanldeSignup()}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Signup</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Secondarybutton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

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
  errorText: {
    color: Colors.error,
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
  },
});
