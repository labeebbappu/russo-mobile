import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "src/theme/colors";

const TAB_CONFIG = [
  {
    route: "AppUserHome",
    icon: "home",
    label: "Home",
  },
  { route: "UsersList", icon: "people-sharp", label: "Accounts" },
];

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={styles.tabContainer}>
      {TAB_CONFIG.map((tab) => {
        const focused = route.name === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => {
              if (!focused) navigation.navigate(tab.route as never);
            }}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={focused ? "#000000" : "#6C757D"}
              style={styles.tabIcon}
            />
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {focused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default BottomNavigation;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 7,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 62,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    width: "100%",
    position: "relative",
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.charcoal,
    fontWeight: "600",
    marginBottom: 4,
  },
  tabLabelActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    left: "28%",
    right: "28%",
    height: 3,
    backgroundColor: "#6C757D",
    borderRadius: 2,
  },
});
