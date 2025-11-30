import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "src/theme/colors";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@apollo/client/react";
import { Get_App_Account_Users } from "src/api/queries";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "src/components/BottomNavigation";

interface UserData {
  userToken: string;
  userId: string;
}

interface AppUsers {
  id: string;
  adminAppName: string;
  adminAppId: string;
  adminCustomerId: string;
  adminCustomerName: string;
  appAccountId: string;
  appAccountTitle: string;
  userFullName: string;
  userEmail: string;
  contactNumber: string;
  userRole: string;
  assignedGroupId: string;
  note: string;
  loginUserId: string;
  status: string;
  actionById: string;
  actionByName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface AppUsersData {
  appAccountUsersGetPagedDataByAccountUser: AppUsers[];
}

const UsersList = ({ navigation, route }) => {
  const userId = route.params.accountId;
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

  const { data, loading, error, refetch } = useQuery<AppUsersData>(
    Get_App_Account_Users,
    {
      variables: {
        appAccountUsersGetPagedDataByAccountUserUserToken2:
          dataStored.userToken,
        appAccountId: userId,
      },
      skip: !dataStored.userToken || !userId,
    }
  );

  const handleEdit = (user: AppUsers) => {
    navigation.navigate("EditUser", { user, onSuccess: refetch });
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

  const users =
    data?.appAccountUsersGetPagedDataByAccountUser?.filter(
      (user) => !user.isDeleted
    ) || [];

  const renderAccount = ({ item }: { item: AppUsers }) => (
    <TouchableOpacity
      style={styles.accountCard}
    //   onPress={() => navigation.navigate("UsersList", { accountId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.accountTitle}>Full Name : {item.userFullName}</Text>
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
      <Text style={styles.customerName}>User Role : {item.userRole}</Text>
      <View className="flex-row gap-1">
        <Text>Email:</Text>
        <Text style={styles.appName}>{item.userEmail}</Text>
      </View>
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
          <Text style={styles.addButton}>+ Add User</Text>
        </TouchableOpacity>
        <FlatList
          data={users}
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

export default UsersList;

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
