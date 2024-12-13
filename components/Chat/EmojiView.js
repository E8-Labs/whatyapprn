import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";

export function getEmojiView(selectedEmoji) {
  const emojiScale = useRef(new Animated.Value(1)).current;

  return selectedEmoji ? (
    <Animated.View
      style={{
        width: 30,
        height: 30,
        backgroundColor: "white",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000", // Shadow color for iOS
        shadowOffset: { width: 0, height: 4 }, // Shadow offset for iOS
        shadowOpacity: 0.1, // Shadow opacity for iOS
        shadowRadius: 5, // Shadow radius for iOS
        elevation: 8, // Elevation for Android
      }}
    >
      <Animated.Text
        style={{ fontSize: 15, transform: [{ scale: emojiScale }] }}
      >
        {selectedEmoji}
      </Animated.Text>
    </Animated.View>
  ) : (
    <Image
      source={require("../../assets/Images/reactBtn.png")}
      style={GlobalStyles.image24}
    />
  );
}
