import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Colors from "../theme/colors";

export default function SplashScreen({ onAnimationEnd }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start(() => {
          if (onAnimationEnd) onAnimationEnd();
        });
      }, 1200);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity }]}>Russo</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.russoGreen,
    letterSpacing: 2,
  },
});
