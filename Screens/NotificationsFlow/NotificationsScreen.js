import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  FlatList,
  SectionList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../res/Colors";
import { CustomFonts } from "../../assets/font/Fonts";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import moment from "moment";

import { placeholderImage, screenWidth } from "../../res/Constants";
import { NotificationType } from "../../res/NotificationsType";
import { Apipath } from "../../Api/Apipaths";
import { unreadNotification } from "../../components/UnreadNotifications";

import { ScreenNames } from "../../res/ScreenNames";

const { height, width } = Dimensions.get("window");

export default function NotificationsScreen({ navigation }) {
  const messageIcon = require("../../assets/Images/messageNotIcon.png");
  const disAgreeReviewIcon = require("../../assets/Images/disAgreeReviewIcon.png");
  const profileViewIcon = require("../../assets/Images/profileViewIcon.png");
  const acceptSettlementIcon = require("../../assets/Images/acceptSettlementIcon.png");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    unreadNotification();
    getNotifications();
  }, []);

  useEffect(() => {
    console.log("sections are ", sections);
  }, [sections]);

  const getNotifications = async () => {
    console.log("trying to get notifications");
    setLoading(true);
    const data = await AsyncStorage.getItem("USER");

    try {
      if (data) {
        let d = JSON.parse(data);
        // console.log('d', d)
        setRole(d.user.role);
        const result = await fetch(
          Apipath.getNotifications + `?offset=${notifications.length}`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + d.token,
            },
          }
        );
        if (result) {
          setLoading(false);
          let json = await result.json();
          if (json.status === true) {
            console.log("user notifications are", json.data);
            setNotifications([...notifications, ...json.data]);
            formateNotifications([...notifications, ...json.data]);
          } else {
            console.log("json message is", json.message);
          }
        }
      }
    } catch (error) {
      console.log("error finding in get notifications", error);
    }
  };

  const formateNotifications = (notArray) => {
    let today = [];
    let yesterday = [];
    let earlier = [];

    let currentdate = new Date();
    let yesterdayDate = new Date();
    yesterdayDate.setDate(currentdate.getDate() - 1);

    for (let i = 0; i < notArray.length; i++) {
      if (notArray[i] && notArray[i].createdAt) {
        let createdAt = new Date(notArray[i].createdAt);

        if (currentdate.toDateString() === createdAt.toDateString()) {
          today.push(notArray[i]);
        } else if (yesterdayDate.toDateString() === createdAt.toDateString()) {
          yesterday.push(notArray[i]);
        } else {
          earlier.push(notArray[i]);
        }
      } else {
        console.log(
          `Notification at index ${i} is undefined or has no createdAt property.`
        );
      }
    }

    console.log("today notifications are ", today);
    console.log("yesterday notifications are ", yesterday);
    console.log("earlier notifications are ", earlier);

    const section = [];
    if (today.length > 0) {
      section.push({ title: "Today", data: today });
    }
    if (yesterday.length > 0) {
      section.push({ title: "Yesterday", data: yesterday });
    }
    if (earlier.length > 0) {
      section.push({ title: "Earlier", data: earlier });
    }
    setSections(section);
  };

  const getNotificationType = (item) => {
    console.log("Getting not type for ", item.type);
    //Wohoo! You received a 5 star review
    if (item.type === NotificationType.FiveStarReview) {
      let not = {
        image: item.fromUser.profile_image
          ? item.fromUser.profile_image
          : placeholderImage,
        message: " Wohoo! You received a 5 star review",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    }
    if (item.type === NotificationType.ReplyReview) {
      let not = {
        image: item.fromUser.profile_image
          ? item.fromUser.profile_image
          : placeholderImage,
        message: item.fromUser.name + " replied to your review",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    } else if (item.type === NotificationType.Disagreement) {
      let not = {
        image: disAgreeReviewIcon,
        message:
          role && role === "admin"
            ? item.fromUser.name + "  submitted a disagreement"
            : item.fromUser.name + " disagreed to your review",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    } else if (item.type === NotificationType.SettlementAccepted) {
      let not = {
        image: acceptSettlementIcon,
        message: item.fromUser.name + " accepted your settlement",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    } else if (item.type === NotificationType.NewMessage) {
      let not = {
        image: messageIcon,
        message: item.fromUser.name + " sent you a message",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    } else if (item.type === NotificationType.ProfileView) {
      let not = {
        image: profileViewIcon,
        message: item.fromUser.name + " viewed your business page",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    } else if (item.type === NotificationType.SettlementOfferSent) {
      let not = {
        image: acceptSettlementIcon,
        message: item.fromUser.name + " sent you a settlement offer",
        time: item.createdAt,
        type: item.type,
      };
      // console.log('notification type data is', not)
      return not;
    } else if (item.type === NotificationType.NewUser) {
      let not = {
        image: item.fromUser.profile_image
          ? item.fromUser.profile_image
          : placeholderImage,
        message: item.fromUser.name + " registered",
        time: item.createdAt,
        type: item.type,
      };
      return not;
    } else if (item.type === NotificationType.SettlementAmountPaid) {
      let not = {
        image: messageIcon,
        message: item.fromUser.name + " paid ",
        time: item.createdAt,
        type: item.type,
      };
      return not;
    } else if (item.type === NotificationType.NewReview) {
      let not = {
        image: messageIcon,
        message: item.fromUser.name + " wrote a review ",
        time: item.createdAt,
        type: item.type,
      };
      return not;
    } else {
      console.log("other notification type", item.type);
    }
  };

  const renderItem = (item) => {
    console.log("trying to render items", item);
    let not = getNotificationType(item);
    console.log("notification object is", not);
    // return

    return (
      <TouchableOpacity
        onPress={() => {
          handleNotPress(item);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "cemter",
            justifyContent: "space-between",
            marginTop: (25 / 930) * height,
            width: screenWidth - 40,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={
                not.type === NotificationType.ReplyReview && not.image
                  ? { uri: not.image }
                  : not.image
              }
              style={{
                height: (46 / 930) * height,
                width: (46 / 930) * height,
                borderRadius: 23,
              }}
            />
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text style={[GlobalStyles.text17, { color: "#333" }]}>
                {not.message}
              </Text>
              <Text style={GlobalStyles.text12}>
                {moment(item.createdAt).format("h:mm A")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNotPress = (not) => {
    if (role === "admin") {
      if (not.type === NotificationType.NewReview) {
        navigation.push(ScreenNames.AdminResolutionsMainScreen);
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View
        style={{
          alignItems: "center",
          height: height,
          width: width,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            width: width - (60 / 430) * width,
            flexDirection: "row",
            alignItems: "center",
            gap: (20 / 430) * width,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={GlobalStyles.backBtn}>
              <Image
                source={require("../../assets/Images/backArrow.png")}
                style={GlobalStyles.image24}
              />
            </View>
          </TouchableOpacity>
          <Text style={GlobalStyles.text14}>Notifications</Text>
          <View></View>
        </View>
        <View style={{ height: height * 0.85 }}>
          {sections && sections.length > 0 ? (
            <SectionList
              showsVerticalScrollIndicator={false}
              sections={sections}
              style={{ backgroundColor: "transparent" }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderItem(item)}
              renderSectionHeader={({ section: { title } }) => (
                // sections.data ? (
                <View
                  style={{
                    width: width - 40,
                    flexDirection: "row",
                    height: 60,
                    paddingTop: (30 / 930) * height,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#999999",
                      fontFamily: CustomFonts.InterMedium,
                    }}
                  >
                    {title}
                  </Text>
                  <View style={[GlobalStyles.divider, { marginTop: 0 }]}></View>
                </View>
                // ):null
              )}
              ListEmptyComponent={() => (
                <View style={{ padding: 10 }}>
                  <Text>No notifications</Text>
                </View>
              )}
              onEndReached={getNotifications}
              onEndReachedThreshold={0.1}
              ListFooterComponent={() => {
                return (
                  <View
                    style={{
                      height: 60,
                      width: "90%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loading && (
                      <ActivityIndicator
                        size={"large"}
                        color={Colors.orangeColor}
                        style={{ alignSelf: "center" }}
                      />
                    )}
                  </View>
                );
              }}
            />
          ) : (
            <View
              style={{
                padding: 10,
                height: height * 0.8,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>No notifications</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
