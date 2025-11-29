import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import { gql } from "@apollo/client";
import Colors from "src/theme/colors";
import { CREATE_APP_ACCOUNT, UPDATE_APP_ACCOUNT } from "src/api/mutations";
import { useMutation } from "@apollo/client/react";
import BottomNavigation from "src/components/BottomNavigation";
import Constants from "expo-constants";

interface AppAccount {
  account: {
    title: string;
    id: string;
  };
}

interface EditAccountValues {
  title: string;
}

interface UpdateAccountResponse {
  appAccountUpdate: {
    id: string;
  };
}

interface CreateAccountResponse {
  appAccountCreateByUser: {
    id: string;
  };
}

interface AccountFormValues {
  title: string;
}

const EditUserScreen = ({ route, navigation }) => {
  const account = route.params?.account;
  const onSuccess = route.params?.onSuccess;
  const isEditMode = !!account;
  const ADMIN_APP_ID = Constants.expoConfig?.extra?.ADMIN_APP_ID;
  const [userToken, setUserToken] = useState<string | null>(null);

  const [updateAccount, { loading: updateLoading, error: updateError }] =
    useMutation<UpdateAccountResponse>(UPDATE_APP_ACCOUNT);

  const [createAccount, { loading: createLoading, error: createError }] =
    useMutation<CreateAccountResponse>(CREATE_APP_ACCOUNT);

  useEffect(() => {
    const getToken = async () => {
      const data = await SecureStore.getItemAsync("userData");
      const token = data ? JSON.parse(data) : null;
      setUserToken(token.userToken);
    };
    getToken();
  }, []);

  const initialValues: EditAccountValues = {
    title: account?.title || "",
  };

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  const handleSubmit = async (values: EditAccountValues) => {
    if (!userToken) {
      Alert.alert("Error", "User token not found");
      return;
    }

    try {
      if (isEditMode) {
        const { data } = await updateAccount({
          variables: {
            userToken,
            appAccountUpdateId: account.id,
            title: values.title,
          },
        });

        if (data?.appAccountUpdate) {
          if (onSuccess) {
            onSuccess();
          }
          Alert.alert("Success", "Account updated successfully", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      } else {
        // Create new account
        const { data } = await createAccount({
          variables: {
            userToken,
            adminAppId: ADMIN_APP_ID,
            title: values.title,
          },
        });

        if (data?.appAccountCreateByUser) {
          if (onSuccess) {
            onSuccess();
          }
          Alert.alert("Success", "Account created successfully", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      }
    } catch (err) {
      console.error(`${isEditMode ? "Update" : "Create"} error:`, err);
      Alert.alert(
        "Error",
        `Failed to ${isEditMode ? "update" : "create"} account. Please try again.`
      );
    }
  };

  if (!userToken) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.russoGreen} />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.offWhite }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            {isEditMode ? "Edit Account" : "Create Account"}
          </Text>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: Partial<AccountFormValues> = {};
              if (!values.title.trim()) {
                errors.title = "Account title is required";
              }
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
                <Text style={styles.label}>Account Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter account title"
                  value={values.title}
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                />
                {touched.title && errors.title && (
                  <Text style={styles.error}>{errors.title}</Text>
                )}

                {error && (
                  <Text style={styles.error}>Error: {error.message}</Text>
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      loading && styles.disabledButton,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {isEditMode ? "Update Account" : "Create Account"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavigation />
    </>
  );
};

export default EditUserScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.offWhite,
    padding: 24,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.offWhite,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.charcoal,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.deepForest,
    marginBottom: 20,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: Colors.mintGreen,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.charcoal,
    fontWeight: "500",
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.deepForest,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusRow: {
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
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
  error: {
    color: Colors.error,
    marginBottom: 8,
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.whiteSmoke,
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    color: Colors.charcoal,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.russoGreen,
    borderRadius: 8,
    paddingVertical: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
