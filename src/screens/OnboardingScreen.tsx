import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import Colors from "src/theme/colors";
import { Formik } from "formik";
import { useMutation } from "@apollo/client/react";
import { Customer_Onboarding } from "src/api/mutations";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

interface OnboardingValues {
  contactEmail: string;
  country: string;
  primaryCurrency: string;
  city: string;
  name: string;
  address: string;
  officeMobile: string;
}

interface OnboardingResponse {
  adminCustomerOnboarding: {
    id: string;
  };
}

const OnboardingScreen = ({ route, navigation }) => {
  const email = route.params.email;
  const fullName = route.params.fullName;
  const [token, setToken] = useState<string | null>(null);
  const initialValues = {
    contactEmail: email,
    country: "India",
    primaryCurrency: "INR",
    city: "",
    name: "",
    address: "",
    officeMobile: "",
  };

  useEffect(() => {
    const getToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    };
    getToken();
  }, []);

  const [onboarding, { loading, error }] =
    useMutation<OnboardingResponse>(Customer_Onboarding);
  const APP_ID = Constants.expoConfig.extra.ADMIN_APP_ID;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.offWhite }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.container]}
        keyboardShouldPersistTaps="handled"
      >
        <Formik<OnboardingValues>
          initialValues={initialValues}
          onSubmit={async (values) => {
            const { data } = await onboarding({
              variables: {
                billingAddressName: values.name,
                billingAddressEmail: values.contactEmail,
                fullName: fullName,
                adminAppId: APP_ID,
                userToken: token,
                customerType: "company",
                designation: "",
                name: values.name,
                contactEmail: values.contactEmail,
                officeMobile: values.officeMobile,
                primaryCurrency: values.primaryCurrency,
                country: values.country,
                city: values.country,
                address: values.address,
                appAccountTitle: values.name,
              },
            });
            if (data.adminCustomerOnboarding.id) {
              navigation.replace("AppUserHome");
            }
          }}
          validate={(values) => {
            const errors: Partial<OnboardingValues> = {};
            if (!values.city) errors.city = "City required";
            if (!values.name) errors.name = "Required";
            if (!values.address) errors.address = "Required";
            if (!values.officeMobile) errors.officeMobile = "Required";
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Organisation Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter organisation name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                placeholder="Email"
                value={values.contactEmail}
                onChangeText={handleChange("contactEmail")}
                onBlur={handleBlur("contactEmail")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={false}
              />
              {touched.contactEmail && errors.contactEmail && (
                <Text style={styles.error}>{errors.contactEmail}</Text>
              )}
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                value={values.country}
                editable={false}
              />
              <Text style={styles.label}>Currency</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "#f0f0f0" }]}
                value={values.primaryCurrency}
                editable={false}
              />
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                value={values.city}
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
              />
              {touched.city && errors.city && (
                <Text style={styles.error}>{errors.city}</Text>
              )}
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                multiline={true}
              />
              {touched.address && errors.address && (
                <Text style={styles.error}>{errors.address}</Text>
              )}
              <Text style={styles.label}>Office Mobile</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter office mobile"
                value={values.officeMobile}
                onChangeText={handleChange("officeMobile")}
                onBlur={handleBlur("officeMobile")}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
              {touched.officeMobile && errors.officeMobile && (
                <Text style={styles.error}>{errors.officeMobile}</Text>
              )}
              {!!error && <Text style={styles.errorText}>{error.message}</Text>}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.offWhite,
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 3,
    color: Colors.charcoal,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    backgroundColor: "white",
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.russoGreen,
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 8,
    fontSize: 13,
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
  },
});
