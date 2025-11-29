import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@apollo/client/react";
import { Auth_Verification } from "src/api/mutations";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Modal } from "react-native";
import Colors from "src/theme/colors";

interface AuthResponse {
  authVerify: {
    fullName: string;
  };
}

type UserData = string | null;

const CustomHeader = ({ title = "Home" }) => {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData>(null);
  const [auth, { loading, error }] =
    useMutation<AuthResponse>(Auth_Verification);
  const APP_SECRET = Constants.expoConfig.extra.APP_SECRET;
  const checkAuth = async () => {
    const data = await SecureStore.getItemAsync("userData");
    const token = data ? JSON.parse(data).userToken : null;
    if (token) {
      const { data } = await auth({
        variables: {
          appSecret: APP_SECRET,
          userToken: token,
        },
      });
      setUserData(data?.authVerify.fullName ?? null);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);
  const avatarInitials = userData
    ? userData
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";
  const avatarUrl = undefined;
  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#293D34" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => setLogoutVisible(true)}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{avatarInitials}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 10,
              backgroundColor: "white",
              minWidth: 180,
              alignItems: "center",
            }}
          >
            <Text style={{ marginBottom: 16 }}>
              Are you sure you want to logout?
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.russoGreen,
                padding: 5,
                borderRadius: 6,
                width: "100%",
              }}
              onPress={async () => {
                await SecureStore.deleteItemAsync("userToken");
                await SecureStore.deleteItemAsync("createdAt");
                setLogoutVisible(false);
                navigation.dispatch(StackActions.replace("Login"));
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => setLogoutVisible(false)}
            >
              <Text style={{ color: "#293D34" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: "#FAF9F7",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#293D34",
    flex: 1,
    textAlign: "left",
    marginRight: 40,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccd9ce",
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#293D34",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomHeader;
