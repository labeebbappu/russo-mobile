import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import Colors from "../theme/colors";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Code_Verification, Resend_Verification } from "../api/mutations";
import Constants from "expo-constants";
import { ScrollView } from "react-native";

interface ResendVerificationResponse {
  registrationResendVerification: boolean;
}

interface VerifyEmailResponse {
  registrationVerifyEmail: {
    id: string;
  };
}

const VerificationScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [success, setSuccess] = useState(false);
  const primaryEmail = route.params?.primaryEmail;
  const [resend, { loading, error }] =
    useMutation<ResendVerificationResponse>(Resend_Verification);
  const [verify, { loading: codeLoading, error: codeError }] =
    useMutation<VerifyEmailResponse>(Code_Verification);
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  const resendSuccess = "Code resent successfully";
  useEffect(() => {
    console.log(error);
    console.log(codeError);
  }, [error, codeError]);
  const handleResend = async () => {
    try {
      const { data } = await resend({
        variables: {
          appSecret: APP_SECRET,
          primaryEmail: primaryEmail,
        },
      });
      if (data.registrationResendVerification === true) {
        setSuccess(true);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleVerify = async () => {
    try {
      const { data } = await verify({
        variables: {
          appSecret: APP_SECRET,
          primaryEmail: email,
          verificationCode: verificationCode,
        },
      });
      if (data.registrationVerifyEmail.id) {
        navigation.replace("Login");
      }
    } catch (error) {
      console.log(error);
    }
  };
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
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.agreement}>
          This is done to ensure the security of your account. By clicking on
          the "Verify" button, you are indicating your agreement with our{" "}
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
          placeholder="Email"
          style={styles.input}
          placeholderTextColor={Colors.charcoal}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Verification code"
          placeholderTextColor={Colors.charcoal}
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(formatOtpInput(text))}
          keyboardType="number-pad"
          style={styles.input}
        />
        {!!error && (
          <Text style={{ color: Colors.error, textAlign: "left" }}>
            {error.message}
          </Text>
        )}
        {!!codeError && (
          <Text style={{ color: Colors.error, textAlign: "left" }}>
            {codeError.message}
          </Text>
        )}
        {!!success && (
          <Text style={{ color: Colors.success, textAlign: "left" }}>
            {resendSuccess}
          </Text>
        )}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleVerify()}
          >
            <Text style={styles.primaryButtonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Secondarybutton}
            onPress={() => handleResend()}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.primaryButtonText}>Resend Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;

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
  button: {
    borderRadius: 8,
    backgroundColor: Colors.russoGreen,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
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
});
