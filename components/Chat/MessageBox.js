import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from "react-native";
import { getEmojiView } from "./EmojiView";
import { Colors } from "../../res/Colors";
import React, { useState, useRef } from "react";
import { CustomFonts } from "../../assets/font/Fonts";
import { screenHeight, screenWidth } from "../../res/Constants";
import moment from "moment";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";

const MODAL_WIDTH = 280;
const MessageBox = ({ item, user, sendEmoji }) => {
  let msg = item.item;
  let msgUser = msg && msg.user;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedEmoji, setSelectedEmoji] = useState(msg.emoji || null);
  const emojiScale = useRef(new Animated.Value(1)).current;
  const emojiButtonRef = useRef(null);

  const openEmojiPicker = () => {
    emojiButtonRef.current.measure((fx, fy, width, height, px, py) => {
      let leftPosition = px;
      if (px + MODAL_WIDTH > screenWidth) {
        leftPosition = screenWidth - MODAL_WIDTH - 10; // Adjust to keep within screen
      }
      setModalPosition({ top: py + height, left: leftPosition });
      setShowEmojiPicker(true);
    });
  };

  const handleEmojiSelected = (emoji) => {
    setSelectedEmoji(emoji);
    sendEmoji(emoji, msg.id);
    setShowEmojiPicker(false);

    // Trigger the scale animation
    Animated.sequence([
      Animated.timing(emojiScale, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View
      style={{
        alignItems:
          msgUser && msgUser.id == user.user.id ? "flex-end" : "flex-start",
        marginTop: 10,
        width: screenWidth - 40,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent:
            msgUser && msgUser.id === user.user.id ? "flex-end" : "flex-start",
          alignItems: "center",
          backgroundColor: "transparent",
          width: screenWidth - 40,
        }}
      >
        <View
          style={{
            backgroundColor:
              msgUser && msgUser.id === user.user.id
                ? Colors.orangeColor
                : "#f5f5f5",
            padding: 10,
            marginTop: 5,
            width: "70%",
            alignSelf:
              msgUser && msgUser.id === user.user.id
                ? "flex-end"
                : "flex-start",
            borderRadius: 11,
            borderBottomEndRadius: 15,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: CustomFonts.InterMedium,
              color: msgUser.id === user.user.id ? "white" : "black",
            }}
          >
            {msg.message}
          </Text>
          {msgUser && msgUser.id === user.user.id ? (
            <>
              <View style={styles.rightArrow}></View>
              <View style={styles.rightArrowOverlap}></View>
            </>
          ) : (
            <>
              <View style={styles.leftArrow}></View>
              <View style={styles.leftArrowOverlap}></View>
            </>
          )}
          <Text
            style={{
              fontSize: 14,
              fontFamily: CustomFonts.InterMedium,
              color: msgUser && msgUser.id === user.user.id ? "white" : "black",
              textAlign: "right",
            }}
          >
            {moment(msg.createdAt).format("h:mm")}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        ref={emojiButtonRef}
        onPress={openEmojiPicker}
        style={{ backgroundColor: "transparent" }}
      >
        {getEmojiView(msg.emoji)}
      </TouchableOpacity>

      <Modal animationType="fade" visible={showEmojiPicker} transparent={true}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEmojiPicker(false)}
        >
          {/* Empty View to allow dismissing on outside tap */}
        </TouchableOpacity>

        <View
          style={[
            styles.modalContent,
            { top: modalPosition.top, left: modalPosition.left },
          ]}
        >
          <EmojiSelector
            category={Categories.all}
            columns={6}
            showSearchBar = {false}
            showTabs={false}
            onEmojiSelected={handleEmojiSelected}
          />
        </View>
      </Modal>
    </View>
  );
};

export default MessageBox;

const styles = StyleSheet.create({
  rightArrow: {
    position: "absolute",
    backgroundColor: Colors.orangeColor,
    width: 20,
    height: 20,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "white",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },
  leftArrow: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },
  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#fff",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    position: "absolute",
    width: MODAL_WIDTH,
    height: screenHeight / 2.4,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});
