import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ActivityIndicator,
} from "react-native";
import { getEmojiView } from "./EmojiView";
import moment from "moment";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { screenHeight, screenWidth } from "../../res/Constants";
import { ImageViewer } from "../ImageViewer";

export const ImageMessageBox = ({ item, user, sendEmoji }) => {
  let msg = item.item;
  let msgUser = msg && msg.user;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(msg.emoji || null);
  const emojiScale = useRef(new Animated.Value(1)).current;
  const [imageLoading, setImageLoading] = useState(true); // Track image loading state
  const [imageError, setImageError] = useState(false); // Track image load errors
  const emojiButtonRef = useRef(null);

  const [openImage,setOpenImage] =useState(null)

  const MODAL_WIDTH = 280;
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

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

    // Trigger the scale animation for selected emoji
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
          msgUser && msgUser.id === user.user.id ? "flex-end" : "flex-start",
        marginTop: 10,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          padding: 8,
          borderRadius: 12,
          borderColor: "#ccc",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 8,
        }}
      >
        {/* Placeholder with Activity Indicator or Error Fallback */}
        {imageLoading && !imageError && (
          <View style={styles.placeholderContainer}>
            <ActivityIndicator size="small" color="#888" />
          </View>
        )}

        {/* {imageError && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.errorText}>Image failed to load</Text>
          </View>
        )} */}

        {/* Log the image URL */}
        {/* {console.log("Image URL:", msg.media)} */}

        {/* Image content with error handling */}
        <TouchableOpacity
            onPress={()=>{
              setOpenImage(msg.media)
            }}
        >
          <Image
            source={{ uri: msg.media }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              marginBottom: 8,
              backgroundColor: "#f0f0f0",
              // display: imageLoading ? "none" : "flex",
            }}
            onLoadStart={() => {
              // console.log("Image loaded successfully");
              setImageLoading(false);
            }}
            onError={(error) => {
              // console.log("Image failed to load:", error);
              setImageLoading(false);
              setImageError(true);
            }}
          />
        </TouchableOpacity>

        <View style={{ justifyContent: "flex-end", width: 150 }}>
          <Text style={styles.timeText}>
            {moment(msg.createdAt).format("h:mm A")}
          </Text>
        </View>
      </View>

      <ImageViewer visible={openImage != null} close={()=>{setOpenImage(null)}} url={openImage}/>

      {/* Emoji Reaction Button */}
      <TouchableOpacity ref={emojiButtonRef} onPress={openEmojiPicker}>
        {getEmojiView(msg.emoji)}
      </TouchableOpacity>



      {/* Emoji Picker Modal */}
      <Modal animationType="fade" visible={showEmojiPicker} transparent={true}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEmojiPicker(false)}
        ></TouchableOpacity>

        <View
          style={[
            styles.modalContent,
            { top: modalPosition.top, left: modalPosition.left },
          ]}
        >
          <EmojiSelector
            category={Categories.all}
            showSearchBar = {false}
            columns={6}
            showSectionTitles = {false}
            showTabs={false}
            onEmojiSelected={handleEmojiSelected}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "right",
  },
  errorText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
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
    width: 280,
    height: screenHeight / 2.4,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default ImageMessageBox;

const CustomImage = ({ style, source }) => {
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const memorizedImage = useMemo(
    () => (
      <Image
        style={style}
        source={source}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoad={handleLoad}
      />
    ),
    [source]
  );

  return (
    <View>
      {loading && (
        <ActivityIndicator
          color="#008000"
          style={{ ...style, position: "absolute" }}
        />
      )}
      {memorizedImage}
    </View>
  );
};
