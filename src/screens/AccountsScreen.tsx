import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GetAppUsers } from "src/api/queries";
import Colors from "src/theme/colors";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import BottomNavigation from "src/components/BottomNavigation";

const UserAccounts = ({ navigation, route }) => {
  interface AppAccount {
    id: string;
    adminAppName: string;
    adminAppId: string;
    adminCustomerId: string;
    adminCustomerName: string;
    title: string;
    status: string;
    actionById: string;
    actionByName: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  }

  interface AppAccountsData {
    appAccountsGetPagedDataByAppUser: AppAccount[];
  }

  interface UserData {
    userToken: string;
    userId: string;
  }
  const APP_ID = Constants.expoConfig.extra.ADMIN_APP_ID;
  const [dataStored, setDataStored] = useState<UserData>({
    userToken: "",  
    userId: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      const storedData = await SecureStore.getItemAsync("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setDataStored(parsedData);
      }
    };
    getUserData();
  }, []);
  const { data, loading, error, refetch } = useQuery<AppAccountsData>(
    GetAppUsers,
    {
      variables: {
        userToken: dataStored.userToken,
        adminAppId: APP_ID,
        appAccountUserId: dataStored.userId,
      },
      skip: !dataStored.userToken || !dataStored.userId,
    }
  );

  const handleEdit = (account: AppAccount) => {
    navigation.navigate("EditUser", { account, onSuccess: refetch });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.russoGreen} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accounts =
    data?.appAccountsGetPagedDataByAppUser?.filter(
      (account) => !account.isDeleted
    ) || [];

  const renderAccount = ({ item }: { item: AppAccount }) => (
    <TouchableOpacity
      style={styles.accountCard}
      onPress={() =>
        navigation.navigate("UsersList", { accountId: item.id })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.accountTitle}>Account : {item.title}</Text>
        <View style={styles.headerRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
            accessibilityLabel="Edit account"
          >
            <Ionicons name="pencil" size={20} color={Colors.russoGreen} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.customerName}>
        Organisation : {item.adminCustomerName}
      </Text>
      {/* <Text style={styles.appName}>{item.adminAppName}</Text> */}
      <View style={styles.cardFooter}>
        <Text style={styles.actionBy}>Action By: {item.actionByName}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <View style={styles.container} className="flex-col">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditUser", { onSuccess: refetch })
          }
        >
          <Text style={styles.addButton}>+ Add Account</Text>
        </TouchableOpacity>
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No accounts found</Text>
            </View>
          }
        />
      </View>
      <BottomNavigation />
    </>
  );
};

export default UserAccounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  listContent: {
    padding: 16,
  },
  addButton: {
    padding: 10,
    backgroundColor: Colors.russoGreen,
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    marginHorizontal: 16,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: "flex-end",
  },
  accountCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.deepForest,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  editButton: {
    padding: 6,
    borderRadius: 6,
  },
  customerName: {
    fontSize: 16,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  appName: {
    fontSize: 14,
    color: Colors.russoGreen,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  actionBy: {
    fontSize: 13,
    color: Colors.charcoal,
  },
  date: {
    fontSize: 13,
    color: Colors.charcoal,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.charcoal,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.russoGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.charcoal,
  },
});

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "#4CAF50";
    case "pending":
      return "#FF9800";
    case "inactive":
      return "#9E9E9E";
    default:
      return Colors.charcoal;
  }
};
