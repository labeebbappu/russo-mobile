import { Link } from "@react-navigation/native";
import {
    Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../theme/colors";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Forget_Password, Reset_Password } from "../api/mutations";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView } from "react-native";

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [sendCode, { loading, error }] = useMutation(Forget_Password);
  const [showCode, setShowCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [reset, { loading: resetLoading, error: resetError }] =
    useMutation(Reset_Password);
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  const handleCode = async () => {
    const { data } = await sendCode({
      variables: {
        appSecret: APP_SECRET,
        username: email,
      },
    });
    console.log(data);
    if (data.authForgetPasswordRequest.verificationCode) {
      setShowCode(true);
    }
  };
  const handleReset = async () => {
    const { data } = await reset({
      variables: {
        appSecret: APP_SECRET,
        username: email,
        verificationCode: verificationCode,
        newPassword: password,
      },
    });
    if (data.authForgetPasswordVerifyAndChange.fullName) {
      navigation.replace("Login");
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
        <Text style={styles.title}>Password Reset</Text>
        <Text style={styles.agreement}>
          This is done to ensure the security of your account. By clicking on
          the "Reset" button, you are indicating your agreement with our{" "}
          <Link>terms and conditions.</Link>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.charcoal}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          returnKeyType="done"
        />
        {!!showCode && (
          <>
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
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
            <TextInput
              placeholder="Verification code"
              placeholderTextColor={Colors.charcoal}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              style={styles.input}
            />
          </>
        )}
        {!!error && <Text style={styles.errorText}>{error.message}</Text>}
        {!!resetError && (
          <Text style={styles.errorText}>{resetError.message}</Text>
        )}
        {showCode ? (
          <TouchableOpacity style={styles.button} onPress={() => handleReset()}>
            <Text style={styles.primaryButtonText}>Reset Password</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => handleCode()}>
            <Text style={styles.primaryButtonText}>Send Code</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPasswordScreen;

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
  primaryButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
    color: "white",
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
  },
});
