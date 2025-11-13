import { StyleSheet } from "react-native";
import { View } from "react-native";
import Colors from "../theme/colors";

const VerificationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <Text style={styles.agreement}>
        This is done to ensure the security of your account. By clicking on the
        "Signup" button, you are indicating your agreement with our{" "}
        <Link>terms and conditions.</Link>
      </Text>
    </View>
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
});
