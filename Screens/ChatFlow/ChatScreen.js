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
import {
  placeholderImage,
  screenHeight,
  screenWidth,
} from "../../res/Constants";
import socket from "../../Api/socket";
import GaleryCamPopup from "../../components/GaleryCamPopup";
import * as FileSystem from "expo-file-system";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { CustomFonts } from "../../assets/font/Fonts";
import React, { useState, useEffect, useRef } from "react";
import MessageBox from "../../components/Chat/MessageBox";
import ImageMessageBox from "../../components/Chat/ImageMessageBox";
import axios from "axios";
import { Apipath } from "../../Api/Apipaths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../res/Colors";
import { Audio } from "expo-av";
import VoiceMessagePlayer from "./VoiceMessagePlayer";

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Selected image for preview
  const [recording, setRecording] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordingPopup, setRecordingPopup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [cancelRecording, setCancelRecording] = useState(false);
  const [audioURI, setAudioURI] = useState(null);

  const chat = route.params.chat;
  const chatId = chat.id;
  let listViewRef = useRef(null);
  const recordingInstance = useRef(null);


  useEffect(() => {
    socket.on("receiveMessage" + chatId, (data) => {
      const messageData = data;
      console.log("Message received", messageData);

      if (messageData.status) {
        setMessages((prevMessages) => {
          const messageIndex = prevMessages.findIndex(
            (m) => m.id == messageData.message.id
          );

          if (messageIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[messageIndex].emoji = messageData.message.emoji;
            console.log("Message updated");
            return updatedMessages;
          } else {
            return [...prevMessages, messageData.message];
          }
        });
      } else {
        conse.log(messageData.message);
      }
    });

    return () => {
      socket.off("receiveMessage" + chatId);
    };
  }, [chatId]);

  useEffect(() => {
    loadMessages();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const data = await AsyncStorage.getItem("USER");
    if (data) {
      const u = JSON.parse(data);
      const messageData = {
        token: u.token,
        chatId: chatId,
        messageContent: inputMessage,
      };

      socket.emit("sendMessage", messageData);
      setInputMessage("");
    }
  };

  async function sendVoice(base64Audio) {
    const data = await AsyncStorage.getItem("USER");
    if (data) {
      const u = JSON.parse(data);

      socket.emit("sendMessage", {
        token: u.token,
        chatId: chatId, // Replace with your actual chat ID
        messageContent: "", // Optional message content
        audio: {
          buffer: base64Audio, // Base64-encoded audio data
          originalname: "audio.m4a", // Audio filename with extension
          mimetype: "audio/m4a", // MIME type of the audio
        },
      });
    }

    console.log("Audio data sent via socket");
  }
  const loadMessages = async () => {
    try {
      const data = await AsyncStorage.getItem("USER");
      if (data) {
        let u = JSON.parse(data);
        setUser(u);
        let path = Apipath.loadMessages + "?chatId=" + chatId;
        const response = await axios.get(path, {
          headers: {
            Authorization: "Bearer " + u.token,
          },
        });

        if (response.data && response.data.status === true) {
          setMessages((prevMessages) => [
            ...prevMessages,
            ...response.data.data,
          ]);
          setInputMessage("");
        }
      }
    } catch (e) {
      //conse.error("Error loading messages:", e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow camera access to continue");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPreviewImage(imageUri); // Set preview image
      setShowPopup(false);
    }
  };

  const sendImageMessage = async () => {
    if (!previewImage) return;

    const data = await AsyncStorage.getItem("USER");
    if (data) {
      const u = JSON.parse(data);
      const fileType = previewImage.split(".").pop();
      const fileName = `image_${Date.now()}.${fileType}`;
      const imageBuffer = await FileSystem.readAsStringAsync(previewImage, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const messageData = {
        chatId: chatId,
        messageContent: "", // No caption
        file: {
          buffer: imageBuffer,
          originalname: fileName,
          mimetype: `image/${fileType}`,
        },
        token: u.token,
      };
      //conse.log("Will send image message");
      socket.emit("sendMessage", messageData);
      setPreviewImage(null); // Reset preview image
    }
  };

  const sendEmoji = (emoji, msgid) => {
    // //conse.log("emoji ", emoji);
    if (!user) {
      return;
    }
    const messageData = {
      token: user.token, // JWT token for authentication
      messageId: msgid, // ID of the chat session
      emoji: emoji, // The message content
    };

    // //conse.log('Sending message data:', messageData);
    // Emit the message to the socket server
    socket.emit("reactOnMessage", messageData);
  };

  // async function startRecording() {
  //   try {
  //     // Check for microphone permission
  //     if (permissionResponse.status !== "granted") {
  //       const permission = await requestPermission();
  //       if (permission.status !== "granted") {
  //         console.warn("Microphone permission not granted");
  //         return;
  //       }
  //     }

  //     // Prevent starting another recording if already in progress
  //     if (recording) {
  //       console.warn("Recording is already in progress");
  //       return;
  //     }

  //     setRecordingPopup(true);
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     // Start a new recording
  //     const { recording: newRecording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY
  //     );

  //     setRecording(newRecording); // Set the recording state to the new recording object.
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //   }
  // }

  // async function stopRecording() {
  //   if (!recording) return;

  //   setRecordingPopup(false);
  //   try {
  //     await recording.stopAndUnloadAsync();
  //     await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  //     const uri = recording.getURI(); // Get the URI of the recorded audio file
  //     console.log("Recorded message URI:", uri);

  //     // Convert audio file to base64
  //     const base64Audio = await FileSystem.readAsStringAsync(uri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Send base64 audio data over socket
  //     sendVoice(base64Audio);

  //     // Clear the recording instance after stopping
  //     setRecording(undefined);
  //   } catch (err) {
  //     console.error("Failed to stop recording", err);
  //   }
  // }

  function getSenderUserName(chat) {
    if (user) {
      if (user.user.role == "customer") {
        return chat.Business.name;
      }
      return chat.Customer.name;
    }

    return "";
  }

  function getSenderImage(chat) {
    if (user) {
      if (user.user.role == "customer") {
        return chat.Business.name;
      }
      return chat.Customer.name;
    }

    return "";
  }

  const recordingAnimation = useRef(new Animated.Value(0)).current;
  const timerInterval = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        setCancelRecording(true);
      } else {
        setCancelRecording(false);
      }
    },
    onPanResponderRelease: async () => {
      if (cancelRecording) {
        cancelVoiceRecording();
      } else {
        await stopRecording();
      }
    },
  });

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Microphone permission not granted");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingInstance.current = recording;
      setIsRecording(true);
      startTimer();

      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingInstance.current) return;

      Animated.timing(recordingAnimation).stop();
      await recordingInstance.current.stopAndUnloadAsync();
      const uri = recordingInstance.current.getURI();

      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      sendVoice(base64Audio)
      setIsRecording(false);
      resetTimer();
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const cancelVoiceRecording = () => {
    if (recordingInstance.current) {
      recordingInstance.current.stopAndUnloadAsync();
    }
    setIsRecording(false);
    resetTimer();
    console.log("Recording canceled");
  };

  const startTimer = () => {
    setRecordingTimer(0);
    timerInterval.current = setInterval(() => {
      setRecordingTimer((prev) => prev + 1);
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timerInterval.current);
    setRecordingTimer(0);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };


  const renderMicButton = () => (
    isRecording ? (
      <View style={styles.recordingContainer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.recordingIndicator,
            { transform: [{ scale: recordingAnimation }] },
          ]}
        />
        <Text style={styles.recordingText}>
          {cancelRecording ? "Release to Cancel" : formatTimer(recordingTimer)}
        </Text>
      </View>
    ) : (
      <TouchableOpacity onPress={startRecording} style={styles.micButton}>
        <Image
          source={require("../../assets/Images/micIcon.png")}
          style={styles.micIcon}
        />
      </TouchableOpacity>
    )
  );

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.container}>
        <View style={GlobalStyles.completeProfileTopBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../assets/Images/backArrow.png")}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>
          <View style={{ alignItems: "center", gap: 5 }}>
            <Image
              source={
                user && user.user.id === chat.Business.id ? (chat.Customer.profile_image
                  ? { uri: chat.Customer.profile_image }
                  : placeholderImage) : (chat.Business.profile_image
                    ? { uri: chat.Business.profile_image }
                    : placeholderImage

                )
              }
              style={{
                height: (44 / 930) * screenHeight,
                width: (44 / 930) * screenHeight,
                resizeMode: "cover",
                borderRadius: 25,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: CustomFonts.InterMedium,
                color: "#333",
              }}
            >
              {getSenderUserName(chat)}
            </Text>
          </View>
          <TouchableOpacity style={{ opacity: 0 }}>
            <Image
              source={require("../../assets/Images/threeDotsImage.png")}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ height: screenHeight * 0.89 }}
        >
          <FlatList
            data={messages}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={(ref) => {
              listViewRef = ref;
            }}
            onContentSizeChange={() => {
              if (listViewRef !== null) {
                listViewRef._listRef._scrollRef.scrollToEnd({
                  animated: true,
                });
              }
            }}
            renderItem={(item) => {
              if (item.item.messageType === "Media") {
                return (
                  <ImageMessageBox
                    item={item}
                    user={user}
                    sendEmoji={sendEmoji}
                  />
                );
              } else if (item.item.messageType === "Voice") {
                return (
                  <VoiceMessagePlayer
                    item={item}
                    user={user}
                    timestamp={item.createdAt}
                  />
                );
              } else {
                return (
                  <MessageBox item={item} user={user} sendEmoji={sendEmoji} />
                );
              }
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              height: (120 / 930) * screenHeight,
              backgroundColor: "transparent",
              width: screenWidth,
              justifyContent: "center",
              paddingHorizontal: 10,
              gap: 8,
              marginBottom: 0
            }}
          >
            {!isRecording ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setShowPopup(true);
                  }}
                >
                  <Image
                    source={require("../../assets/Images/addIcon.png")}
                    style={{
                      height: 24,
                      width: 24,
                      marginTop: (8 / 930) * screenHeight,
                    }}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    width: (246 / 430) * screenWidth,
                    backgroundColor: "#f5f5f5",
                    paddingVertical: 10,
                    borderRadius: 10,
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    placeholder="Send message...."
                    multiline
                    value={inputMessage}
                    onChangeText={(item) => setInputMessage(item)}
                  />
                </View>
              </>
            ) : null

            }
            {renderMicButton()}
            {
              !isRecording && (
                <TouchableOpacity onPress={() => sendMessage()}>
                  <Image
                    source={require("../../assets/Images/blackSendIcon.png")}
                    style={{ height: 40, width: 40 }}
                  />
                </TouchableOpacity>
              )
            }

          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Full-Screen Image Preview Overlay */}
      {previewImage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <View style = {{backgroundColor:'red'}}> */}
          <Image
            source={{ uri: previewImage }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />

          <View
            style={{
              position: "absolute",
              bottom: 40,
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              paddingHorizontal: 20,
              // backgroundColor:'white'
            }}
          >
            <TouchableOpacity
              style={[
                GlobalStyles.capsuleBtn,
                { width: 150, backgroundColor: Colors.grayColor },
              ]}
              onPress={() => setPreviewImage(null)}
            >
              <Text style={[GlobalStyles.BtnText, { color: "black" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendImageMessage}
              style={[GlobalStyles.capsuleBtn, { width: 150 }]}
            >
              <Text style={GlobalStyles.BtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
        // </View>
      )}

      <Modal visible={showPopup} transparent={true} animationType="slide">
        <GaleryCamPopup
          close={() => setShowPopup(false)}
          handleBtnPress={(value) => {
            if (value === "galery") pickImage();
          }}
        />
      </Modal>

      {/* record voice popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={false}
        onRequestClose={() => { }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.stopButton}>
              <Image
                source={require("../../assets/Images/recordinAnimations.gif")}
                style={{ height: 50, width: 80 }}
              />
            </TouchableOpacity>
            <Text style={styles.modalText}>Recording...</Text>
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => {
                stopRecording();
              }}
            >
              <Image
                source={require("../../assets/Images/micIcon.png")}
                style={{ height: 28, width: 28, tintColor: "red" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // width:300
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    width: (300 / 430) * screenWidth,
    height: (180 / 930) * screenHeight,
  },
  stopButton: {
    marginBottom: 20,
  },
  modalText: {
    color: "#333333",
    textAlign: "center",
    fontSize: 16,
  },
  voicecontainer: {
    maxWidth: "70%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  micButton: {
    // backgroundColor: "#007AFF",
    // borderRadius: 30,
    // padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  micIcon: {
    height: 36,
    width: 36,
    marginTop:3
    // tintColor: "white",
  },
  recordingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  recordingIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginRight: 10,
  },
  recordingText: {
    color: "white",
    fontSize: 16,
  },
});
