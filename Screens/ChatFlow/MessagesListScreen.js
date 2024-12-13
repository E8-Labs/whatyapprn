import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { screenHeight, screenWidth } from "../../res/Constants";
import { screensEnabled } from "react-native-screens";
import { CustomFonts } from "../../assets/font/Fonts";
import { Colors } from "../../res/Colors";
import { ScreenNames } from "../../res/ScreenNames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Apipath } from "../../Api/Apipaths";
import axios from "axios";
import LoadingAnimation from "../../components/LoadingAnimation";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

const MessagesListScreen = ({ navigation }) => {
  const profileImage = require("../../assets/Images/profileImage.png");
  const placeholder = require("../../assets/Images/placeholderImage.png");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadChats();
    }, [])
  );
  const loadChats = async () => {
    console.log("trying to load messages");
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem("USER");
      if (data) {
        let u = JSON.parse(data);
        setUser(u);
        const response = await axios.get(Apipath.loadChats, {
          headers: {
            Authorization: "Bearer " + u.token,
          },
        });

        if (response.data) {
          setLoading(false);
          if (response.data.status === true) {
            console.log("loaded messages are", response.data.chats);
            setMessages(response.data.chats);
          } else {
            console.log("load messages api message is", response.data.message);
          }
        }
      }
    } catch (e) {
      setLoading(false);
      console.log("error in load messages api ", e);
    }
  };

  const handleOnPress = (item) => {
    navigation.push(ScreenNames.ChatScreen, {
      chat: item,
    });
  };

  function getSenderUserName(chat) {
    if (user) {
      if (user.user.role == "customer") {
        return chat.Business.name;
      }
      return chat.Customer.name;
    }

    return "";
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {loading && <LoadingAnimation visible={loading} />}
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

          <Text style={GlobalStyles.text14}>Messages</Text>
          <TouchableOpacity
            style={{opacity:0}}
          >
            <Image
              source={require("../../assets/Images/threeDotsImage.png")}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>
        </View>
        {
          messages.length > 0 ? (
            <FlatList
              style={{ marginBottom: 50 }}
              showsVerticalScrollIndicator={false}
              data={messages}
              renderItem={({ item }) => (
                <>
                  <TouchableOpacity onPress={() => handleOnPress(item)}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: screenWidth - 60,
                        alignSelf: "center",
                        paddingTop: 20,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Image
                          source={
                            user&&user.user.id === item.Business.id ? (item.Customer.profile_image
                              ? { uri: item.Customer.profile_image }
                              : placeholder ):(item.Business.profile_image
                                ? { uri: item.Business.profile_image }
                                : placeholder 

                              )
                          }
                          // onLoadStart={() => {
                          //     setLoadImage(true)
                          // }}
                          // onLoadEnd={() => {
                          //     setLoadImage(false)
                          // }}
                          style={{
                            resizeMode: "cover",
                            height: (49 / 930) * screenHeight,
                            width: (49 / 930) * screenHeight,
                            opacity: item.unread ? 100 : 0.8,
                            borderRadius: 25,
                          }}
                        />
                        {/* {
                                            loadImage ? (
                                                <View style={{
                                                    height: 46 / 930 * height, width: 46 / 430 * width, marginLeft: -50, alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <ActivityIndicator style={{}} size={'small'} color={Colors.blueColor} />
                                                </View>
                                            ) : null
                                        } */}

                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 3,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 17,
                              fontFamily: CustomFonts.meduim,
                              color: item.unread ? "#000" : Colors.unreadColor,
                            }}
                          >
                            {getSenderUserName(item)}
                          </Text>
                          <Text
                            numberOfLines={1}
                            lineBreakMode="tail"
                            style={{
                              fontSize: 12,
                              fontFamily: CustomFonts.regular,
                              width: (230 / 430) * screenWidth,
                              color: item.unread ? "#000" : Colors.unreadColor,
                            }}
                          >
                            {item.lastMessage}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: CustomFonts.regular,
                            color: item.unread ? "#000" : Colors.lightBlack,
                          }}
                        >
                          {moment(item.createdAt).format("h:mm A")}
                        </Text>
                        {item.unread ? (
                          <View
                            style={{
                              backgroundColor: Colors.orangeColor,
                              height: 20,
                              borderRadius: 50,
                              width: 20,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                fontFamily: CustomFonts.meduim,
                                color: "white",
                              }}
                            >
                              {item.unread}
                            </Text>
                          </View>
                        ) : (
                          ""
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={[GlobalStyles.divider]}></View>
                </>
              )}
            />
          ) : (
            <Text style={[GlobalStyles.text17,{marginTop:50,color:'black',}]}>
              No message
            </Text>
          )
        }


      </View>
    </SafeAreaView>
  );
};

export default MessagesListScreen;
