import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import VoiceMessagePlayer from "./Screens/ChatFlow/VoiceMessagePlayer";

const TestFile = ({ navigation, route }) => {
  const [messages,setMessages] = useState([])
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPopup, setRecordingPopup] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [cancelRecording, setCancelRecording] = useState(false);
  const [audioURI, setAudioURI] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const recordingAnimation = useRef(new Animated.Value(0)).current;
  const timerInterval = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        setCancelRecording(true);
      }
    },
    onPanResponderRelease: () => {
      if (cancelRecording) {
        cancelVoiceRecording();
      } else {
        stopRecording();
      }
    },
  });

  const startRecording = async () => {
    try {
      // Request permissions if not granted
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (permission.status !== "granted") {
          console.warn("Microphone permission not granted");
          return;
        }
      }

      // Set recording state
      setIsRecording(true);
      setCancelRecording(false);
      setRecordingTimer(0);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);

      // Start timer
      timerInterval.current = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);

      // Start animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    clearInterval(timerInterval.current);
    Animated.timing(recordingAnimation).stop();

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioURI(uri);

      // Convert audio to base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      sendVoice(base64Audio);
      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const cancelVoiceRecording = () => {
    setIsRecording(false);
    clearInterval(timerInterval.current);
    Animated.timing(recordingAnimation).stop();

    if (recording) {
      recording.stopAndUnloadAsync();
    }
    setRecording(null);
    setAudioURI(null);
    console.log("Recording canceled");
  };

  const renderMicButton = () => (
    <View
      {...panResponder.panHandlers}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording}>
        <Image
          source={require("./assets/Images/micIcon.png")}
          style={{
            height: 40,
            width: 40,
            tintColor: isRecording ? "red" : "black",
          }}
        />
      </TouchableOpacity>
      {isRecording && (
        <View style={{ marginLeft: 10 }}>
          <Animated.View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: cancelRecording ? "gray" : "red",
              opacity: recordingAnimation,
            }}
          />
          <Text style={{ color: "gray", marginTop: 5 }}>
            {cancelRecording ? "Swipe to cancel" : formatTimer(recordingTimer)}
          </Text>
        </View>
      )}
    </View>
  );

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={(item) => (
          <View>
            {item.item.messageType === "Voice" && (
              <VoiceMessagePlayer
                item={item}
                user={user}
                timestamp={item.createdAt}
              />
            )}
          </View>
        )}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        {renderMicButton()}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={""}
          onChangeText={(text) => setInputMessage(text)}
        />
        <TouchableOpacity >
          <Image
            source={require("./assets/Images/blackSendIcon.png")}
            style={{ height: 40, width: 40 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 10,
  },
});

export default TestFile;
