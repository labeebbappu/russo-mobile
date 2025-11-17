import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../theme/colors";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Forget_Password, Reset_Password } from "../api/mutations";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView } from "react-native";

interface ForgetPasswordResponse {
  authForgetPasswordRequest: {
    verificationCode: string;
  };
}

interface PasswordResetResponse {
  authForgetPasswordVerifyAndChange: {
    fullName: string;
  };
}

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [sendCode, { loading, error }] =
    useMutation<ForgetPasswordResponse>(Forget_Password);
  const [showCode, setShowCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [reset, { loading: resetLoading, error: resetError }] =
    useMutation<PasswordResetResponse>(Reset_Password);
  const [localError, setLocalError] = useState("");
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
    if (!password) {
      setLocalError("Please enter a password");
      return;
    } else if (password.length < 4) {
      setLocalError("Please enter atleast 4 characters in password");
      return;
    }
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
  useEffect(() => {
    setLocalError("");
  }, [password]);
  function formatOtpInput(text) {
    const digits = text.replace(/\D/g, "");
    return digits.replace(/(\d{2})(?=\d)/g, "$1 ");
  }
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
                style={[styles.input, { color: Colors.charcoal }]}
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
              onChangeText={(text) => setVerificationCode(formatOtpInput(text))}
              keyboardType="number-pad"
              style={styles.input}
            />
          </>
        )}
        {!!error && <Text style={styles.errorText}>{error.message}</Text>}
        {!!resetError && (
          <Text style={styles.errorText}>{resetError.message}</Text>
        )}
        {!!localError && <Text style={styles.errorText}>{localError}</Text>}
        {showCode ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleReset()}
            >
              <Text style={styles.primaryButtonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Secondarybutton}
              onPress={() => navigation.replace("Login")}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCode()}
            >
              <Text style={styles.primaryButtonText}>Send Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Secondarybutton}
              onPress={() => navigation.replace("Login")}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 8,
  },
  primaryButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
    color: "white",
  },
  Secondarybutton: {
    borderRadius: 8,
    backgroundColor: Colors.whiteSmoke,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ccc",
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
