import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "src/theme/colors";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_ACCOUNT_USER, UPDATE_ACCOUNT_USER } from "src/api/mutations";
import * as SecureStore from "expo-secure-store";
import { Formik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";

interface UpdateAccountResponse {
  appAccountUsersUpdate: {
    userFullName: string;
    userEmail: string;
    contactNumber: string;
    userRole: string;
    note: string;
  };
}

interface CreateAccountResponse {
  appAccountUsersCreateByAccountUser: {
    id: string;
  };
}

interface EditUserValues {
  userFullName: string;
  userEmail: string;
  contactNumber: string;
  userRole: string;
  note: string;
}

interface UserFormValues {
  userFullName: string;
  userEmail: string;
  contactNumber: string;
  userRole: string;
  note: string;
}

const UserEditScreen = ({ route, navigation }) => {
  const user = route.params?.user;
  const accountId = route.params?.accountId;
  const isEditMode = !!user;
  const [userToken, setUserToken] = useState<string | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { label: "Admin", value: "account-admin" },
    { label: "User", value: "account-user" },
  ]);

  const [updateAccount, { loading: updateLoading, error: updateError }] =
    useMutation<UpdateAccountResponse>(UPDATE_ACCOUNT_USER);

  const [createAccount, { loading: createLoading, error: createError }] =
    useMutation<CreateAccountResponse>(CREATE_ACCOUNT_USER);

  useEffect(() => {
    const getToken = async () => {
      const data = await SecureStore.getItemAsync("userData");
      const token = data ? JSON.parse(data) : null;
      setUserToken(token.userToken);
    };
    getToken();
  }, []);

  const initialValues: EditUserValues = {
    userFullName: user?.userFullName || "",
    userEmail: user?.userEmail || "",
    contactNumber: user?.contactNumber?.toString() || "",
    userRole: user?.userRole || "",
    note: user?.note || "",
  };

  const handleSubmit = async (values: EditUserValues) => {
    if (!userToken) {
      Alert.alert("Error", "User token not found");
      return;
    }

    try {
      if (isEditMode) {
        const { data } = await updateAccount({
          variables: {
            userToken,
            appAccountUsersUpdateId: user.id,
            userFullName: values.userFullName,
            userEmail: values.userEmail,
            contactNumber: values.contactNumber || null,
            userRole: values.userRole,
            note: values.note,
          },
        });
        console.log("Update response data:", data);
        if (data?.appAccountUsersUpdate) {
          Alert.alert("Success", "User updated successfully", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      } else {
        const { data } = await createAccount({
          variables: {
            userToken,
            appAccountId: accountId,
            userFullName: values.userFullName,
            userEmail: values.userEmail,
            contactNumber: values.contactNumber || null,
            userRole: values.userRole,
            note: values.note,
          },
        });

        if (data?.appAccountUsersCreateByAccountUser) {
          Alert.alert("Success", "User created successfully", [
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
        `Failed to ${isEditMode ? "update" : "create"} user. Please try again.`
      );
    }
  };

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

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
          nestedScrollEnabled={true}
        >
          <Text style={styles.title}>
            {isEditMode ? "Edit Account" : "Create Account"}
          </Text>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: Partial<UserFormValues> = {};

              if (!values.userFullName.trim()) {
                errors.userFullName = "Full Name is required";
              }

              if (!values.userEmail.trim()) {
                errors.userEmail = "Email is required";
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.userEmail)) {
                errors.userEmail = "Invalid email format";
              }

              if (!values.userRole) {
                errors.userRole = "User Role is required";
              }

              if (
                values.contactNumber &&
                !/^\d{10,15}$/.test(values.contactNumber)
              ) {
                errors.contactNumber = "Invalid contact number (10-15 digits)";
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
              setFieldValue,
            }) => (
              <>
                <Text style={styles.label}> Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter user full name"
                  value={values.userFullName}
                  onChangeText={handleChange("userFullName")}
                  onBlur={handleBlur("userFullName")}
                />
                {touched.userFullName && errors.userFullName && (
                  <Text style={styles.error}>{errors.userFullName}</Text>
                )}

                {error && (
                  <Text style={styles.error}>Error: {error.message}</Text>
                )}

                <Text style={styles.label}> Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter user email"
                  value={values.userEmail}
                  onChangeText={handleChange("userEmail")}
                  onBlur={handleBlur("userEmail")}
                />
                {touched.userEmail && errors.userEmail && (
                  <Text style={styles.error}>{errors.userEmail}</Text>
                )}

                {error && (
                  <Text style={styles.error}>Error: {error.message}</Text>
                )}

                <Text style={styles.label}> Contact Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter user contact number"
                  value={values.contactNumber}
                  onChangeText={handleChange("contactNumber")}
                  onBlur={handleBlur("contactNumber")}
                  keyboardType="number-pad"
                />
                {touched.contactNumber && errors.contactNumber && (
                  <Text style={styles.error}>{errors.contactNumber}</Text>
                )}

                {error && (
                  <Text style={styles.error}>Error: {error.message}</Text>
                )}

                <Text style={styles.label}> Note</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Note"
                  value={values.note || ""}
                  onChangeText={handleChange("note")}
                  onBlur={handleBlur("note")}
                  multiline={true}
                />
                {touched.note && errors.note && (
                  <Text style={styles.error}>{errors.note}</Text>
                )}

                {error && (
                  <Text style={styles.error}>Error: {error.message}</Text>
                )}

                <Text style={styles.label}> User Role*</Text>
                <DropDownPicker
                  open={roleOpen}
                  value={values.userRole}
                  items={roleItems}
                  setOpen={setRoleOpen}
                  setValue={(callback) => {
                    const newValue = callback(values.userRole);
                    setFieldValue("userRole", newValue);
                  }}
                  setItems={setRoleItems}
                  placeholder="Select user role"
                  listMode="SCROLLVIEW"
                  modalProps={{
                    animationType: "slide",
                  }}
                  modalTitle="Select User Role"
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                />

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
    </>
  );
};

export default UserEditScreen;

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

  dropdownContainer: {
    width: 95,
    height: 28,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },

  dropDownContainerStyle: {
    borderColor: "#D3D3D3",
    zIndex: 5000,
    marginTop: 2,
    elevation: 5000,
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
