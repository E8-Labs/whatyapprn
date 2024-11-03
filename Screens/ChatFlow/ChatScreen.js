import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  placeholderImage,
  screenHeight,
  screenWidth,
} from "../../res/Constants";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { CustomFonts } from "../../assets/font/Fonts";
import React, { useState, useEffect, useRef } from "react";
import MessageBox from "../../components/MessageBox";
import io from "socket.io-client";
import axios from "axios";
import { Apipath } from "../../Api/Apipaths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

const ChatScreen = ({ navigation, route }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState("");
  //   const [slectedMessage, setSelectedMessage] = useState(null);
  let listViewRef = useRef(null);

  const SERVER_URL = "ws://185.28.22.219:8004";

  const chat = route.params.chat;
  let chatId = chat.id;
  //   console.log("chat.id", chat);
  // Connect to the socket server when the component mounts
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      // query: { chatId },
    });

    // Save socket instance to state
    setSocket(newSocket);

    // Listen for messages from the server
    // console.log("Receiving messages on ", "receiveMessage" + chatId);
    newSocket.on("receiveMessage" + chatId, (data) => {
      const messageData = data;
      console.log("Message received", messageData);

      if (messageData.status) {
        setMessages((prevMessages) => {
          // Check if the message with the same ID already exists
          const messageIndex = prevMessages.findIndex(
            (m) => m.id == messageData.message.id
          );

          if (messageIndex !== -1) {
            // If message exists, update the emoji for that message
            const updatedMessages = [...prevMessages];
            updatedMessages[messageIndex].emoji = messageData.message.emoji;
            console.log("Message updated");
            return updatedMessages;
          } else {
            // If message doesn't exist, add it to the end
            return [...prevMessages, messageData.message];
          }
        });
      } else {
        console.log(messageData.message); // Handle errors if any
      }
    });

    // Handle disconnection
    return () => {
      newSocket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    loadMessages();
  }, []);

  // Handle sending a message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const data = await AsyncStorage.getItem("USER");
    if (data && socket) {
      const u = JSON.parse(data);
      const userMessage = {
        message: inputMessage,
        id: `${chatId}-${messages.length}`, // Unique ID for the message
        user: {
          id: user && user.user.id,
        },
      };

      //   setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage(""); // Clear the input after sending

      const messageData = {
        token: u.token, // JWT token for authentication
        chatId: chatId, // ID of the chat session
        messageContent: inputMessage, // The message content
      };

      // console.log('Sending message data:', messageData);

      // Emit the message to the socket server
      socket.emit("sendMessage", messageData);
    } else {
      //   console.log("User data or socket is not available");
    }
  };

  const loadMessages = async () => {
    try {
      const data = await AsyncStorage.getItem("USER");
      if (data) {
        let u = JSON.parse(data);
        // console.log('user token is', u.token)
        setUser(u);
        let path = Apipath.loadMessages + "?chatId=" + chatId;
        // console.log("path is", path);
        const response = await axios.get(path, {
          headers: {
            Authorization: "Bearer " + u.token,
          },
        });

        // console.log('response is', response)

        if (response.data) {
          if (response.data.status === true) {
            // console.log("loaded messages are", response.data.data);
            setMessages((prevMessages) => [
              ...prevMessages,
              ...response.data.data,
            ]);
            setInputMessage("");
          } else {
            // console.log("load messages api message is", response.data.message);
          }
        }
      }
    } catch (e) {
      //   console.log("error in load messages api is ", e);
    }
  };

  const sendEmoji = (emoji, msgid) => {
    // console.log("emoji ", emoji);
    if (!user) {
      return;
    }
    const messageData = {
      token: user.token, // JWT token for authentication
      messageId: msgid, // ID of the chat session
      emoji: emoji, // The message content
    };

    // console.log('Sending message data:', messageData);
    // Emit the message to the socket server
    socket.emit("reactOnMessage", messageData);
  };

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
                chat.Business.profile_image
                  ? { uri: chat.Business.profile_image }
                  : placeholderImage
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
              {chat.Business.name}
            </Text>
          </View>
          <TouchableOpacity>
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
            renderItem={(item) => (
              <MessageBox
                item={item}
                user={user && user}
                sendEmoji={sendEmoji}
              />
            )}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              height: (110 / 930) * screenHeight,
              backgroundColor: "transparent", //alignSelf:'flex-start',
              width: screenWidth,
              justifyContent: "center",
              paddingHorizontal: 10,
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // setOpenModal(true)
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
                placeholder="Send message...." //value={message}
                multiline
                value={inputMessage}
                autoComplete="none"
                onChangeText={(item) => {
                  setInputMessage(item);
                }}
              />
            </View>
            <TouchableOpacity
            // onPress={recording ? stopRecording : startRecording}
            >
              <Image
                source={require("../../assets/Images/micIcon.png")}
                style={{
                  height: 24,
                  width: 24,
                  marginTop: (8 / 930) * screenHeight,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendMessage()}>
              <Image
                source={require("../../assets/Images/blackSendIcon.png")}
                style={{ height: 52, width: 52 }}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
