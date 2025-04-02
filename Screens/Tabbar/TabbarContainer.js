import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import Purchases from "react-native-purchases";
import { Image } from "expo-image";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiscoverMainScreeen from "../DiscoverFlow/DiscoverMainScreeen";
import ProfileMainScreen from "../ProfileFlow/ProfileMainScreen";
import ReviewsMainScreen from "../ReviewsFlow/ReviewsMainScreen";
import ResoursesMainScreen from "../ResourcesFlow/ResoursesMainScreen";
import { Colors } from "../../res/Colors";
import { CustomFonts } from "../../assets/font/Fonts";
import {
  placeholderImage,
  screenHeight,
  screenWidth,
} from "../../res/Constants";
import AddReviewMainScreen from "../AddReviewFlow/AddReviewMainScreen";
import { ScreenNames } from "../../res/ScreenNames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomerProfileDetails from "../ProfileFlow/CustomerProfileDetails";
import ProfileStackScreen from "../../components/ProfileStackScreen";
import SearchScreen from "../DiscoverFlow/SearchScreen";
import { useFocusEffect } from "@react-navigation/native";
import { getProfile } from "../../components/GetProfile";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { updateProfile } from "../../components/UpdateProfile";
import { ApiKeys } from "../../Api/ApiKeys";

const TabbarContainer = ({ navigation, route }) => {
  const Tab = createBottomTabNavigator();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const [loadImage, setLoadImage] = useState(false);

  const from = route.params.from;
  const RevenueCatApiKey = ApiKeys.RevenueCatApiKey; //"appl_xmLtPRVaCdpCrklyeHGUMguQRlb";

  useEffect(() => {
    if (user) {
      console.log("Initializing RevenueCat Purchases...", user.id);
      Purchases.configure({
        apiKey: RevenueCatApiKey,
        appUserID: `${user?.id}`,
      });
    }
  }, [user]);

  const openModal = () => {
    console.log("Add button pressed");
    setModalVisible(true);
    console.log("Modal visibility set to true, slideAnim: ", slideAnim._value);

    Animated.timing(slideAnim, {
      toValue: screenHeight * 0.4, // Animate upwards (start above tab bar)
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      console.log("Animation completed, slideAnim after: ", slideAnim._value);
    });
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight, // Slide down to bottom (off-screen)
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false);
      console.log("Modal closed and visibility set to false");
    });
  };

  useEffect(() => {
    getNotificationPermission();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    console.log("Attempting to register for push notifications...");

    if (Platform.OS === "android") {
      console.log("Setting notification channel for Android...");
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Check if the device is a physical device (FCM won't work on simulators)
    // if (Device.isDevice) {
    console.log("Checking notification permissions...");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // console.log("Existing notification permission status:", existingStatus);

    if (existingStatus !== "granted") {
      // console.log("Requesting notification permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      // console.log(
      //   "Final notification permission status after request:",
      //   finalStatus
      // );
    }

    // If the final status is not granted, we cannot proceed
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      // console.log("Notification permission not granted.");
      return null;
    }

    try {
      // Ensure the projectId is available for Expo managed workflow
      console.log("Retrieving project ID...");
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Expo Project ID is missing.");
      }

      // Retrieve the FCM token
      console.log("Fetching Expo push token...");
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      updateProfile(token);
      console.log("FCM Token successfully retrieved:", token);
    } catch (error) {
      console.error("Error retrieving FCM token:", error);
      token = `${error}`; // Store error as token for debugging
    }
    // } else {
    //   console.log(
    //     "Attempting to use push notifications on a simulator. This is not supported."
    //   );
    //   alert("Must use a physical device for Push Notifications");
    // }

    return token;
  }

  const getNotificationPermission = async () => {
    console.log("enter in function");
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        // setFcmToken(token)
      }
      console.log("token", token);
      let apidata = {
        fcm_token: token,
      };
      let data = await updateProfile(apidata);

      if (data) {
        // navigation.push(ScreenNames.LocationPremitionScreen)
      }
      // updateProfile(token)
    });
  };

  

  useFocusEffect(

    useCallback(() => {
      DeviceEventEmitter.addListener("UpdateProfile", (data) => {
       checkUserRole()
      });
      const checkUserRole = async () => {
        const data = await AsyncStorage.getItem("USER");
        if (data) {
          let u = JSON.parse(data);
          // console.log('user role in user role function is', u.user.role)
          // u.user.from = "tabbar";
          let d = await getProfile();
          d.from = "tabbar";
          setUser(d);
          setRole(d.role);
          // console.log("user after update is", d);
        }
      };
      checkUserRole();
    }, [])
  );

  useEffect(() => {
    console.log("trying to refresh subscription status");
    refreshSubscriptionStatus();
  }, [user]);

  function checkSubscriptionStatus(info) {
    if (typeof info.entitlements.active["premium"] !== "undefined") {
      console.log(
        "User subscribed to plan Tabbar",
        info.entitlements.active["premium"]
      );
    } else {
      console.log("User not subscribed", user.role);
      if (user.role == "business") {
        console.log("Navigating to Plans");
        // navigation.navigate(ScreenNames.PlansScreen);
      }
    }
  }

  const refreshSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      Purchases.addCustomerInfoUpdateListener((info) => {
        console.log("Listner info user ", info);
        checkSubscriptionStatus(info);
      });
      checkSubscriptionStatus(customerInfo);
    } catch (e) {
      console.error("Error fetching customer info", e);
    }
  };

  return (
    <View style={{ flex: 1, zIndex: 0 }}>
      {showSearchScreen ? (
        <SearchScreen
          hideAnimation={() => {
            setShowSearchScreen(false);
          }}
          from={"tabbar"}
          navigation={navigation}
        />
      ) : (
        <Tab.Navigator
          initialRouteName={from === "addReview" ? "Reviews" : "Discover"}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { height: (100 / 930) * screenHeight },
          }}
        >
          <Tab.Screen
            name="Discover"
            component={DiscoverMainScreeen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../../assets/Images/discoverIcon.png")}
                  style={[
                    styles.image,
                    { tintColor: focused ? Colors.orangeColor : "#00000050" },
                  ]}
                />
              ),
              tabBarLabel: ({ focused }) =>
                focused ? <Text style={styles.labelText}>Discover</Text> : "",
            }}
          />
          <Tab.Screen
            name="Reviews"
            component={ReviewsMainScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../../assets/Images/reviewsIcon.png")}
                  style={[
                    styles.image,
                    { tintColor: focused ? Colors.orangeColor : "#00000050" },
                  ]}
                />
              ),
              tabBarLabel: ({ focused }) =>
                focused ? <Text style={styles.labelText}>Reviews</Text> : "",
            }}
          />
          {role === "business" && (
            <Tab.Screen
              name="AddReview"
              component={DiscoverMainScreeen} // Placeholder screen
              options={{
                tabBarIcon: ({ focused }) => (
                  <TouchableOpacity onPress={openModal}>
                    <Image
                      source={require("../../assets/Images/tabbarAddBtn.png")}
                      style={{
                        height: (80 / 930) * screenHeight,
                        width: (80 / 430) * screenWidth,
                        marginBottom: (20 / 930) * screenHeight,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                ),
                tabBarLabel: "",
              }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();
                  openModal();
                },
              })}
            />
          )}

          <Tab.Screen
            name="Resources"
            component={ResoursesMainScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("../../assets/Images/resoursesIcon.png")}
                  style={[
                    styles.image,
                    { tintColor: focused ? Colors.orangeColor : "#00000050" },
                  ]}
                />
              ),
              tabBarLabel: ({ focused }) =>
                focused ? <Text style={styles.labelText}>Resourses</Text> : "",
            }}
          />
          <Tab.Screen
            name="Profile"
            options={{
              tabBarIcon: ({ focused }) => (
                <>
                  <Image
                    source={
                      user && user.profile_image
                        ? { uri: user.profile_image }
                        : placeholderImage
                    }
                    style={[
                      styles.image,
                      {
                        resizeMode: "cover",
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: focused
                          ? Colors.orangeColor
                          : "transparent",
                      },
                    ]}
                    onLoadEnd={() => {
                      // console.log('image loaded')
                      // setLoadImage(false)
                    }}
                    onLoadStart={() => {
                      // console.log('image loading')
                      // setLoadImage(true)
                    }}
                  />
                  {loadImage && (
                    <View style={{ marginTop: (-30 / 930) * screenHeight }}>
                      <Image
                        source={placeholderImage}
                        style={[
                          styles.image,
                          {
                            borderRadius: 30,
                            borderWidth: 1,
                            // resizeMode:'co',
                            borderColor: focused
                              ? Colors.orangeColor
                              : "transparent",
                          },
                        ]}
                      />
                    </View>
                  )}
                </>
              ),
              tabBarLabel: ({ focused }) =>
                focused ? <Text style={styles.labelText}>Profile</Text> : "",
            }}
          >
            {() => <ProfileStackScreen user={user} from="tabbar" role={role} />}
          </Tab.Screen>
        </Tab.Navigator>
      )}

      {/* Animated Modal */}
      {modalVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <AddReviewMainScreen
            closeModal={closeModal}
            handleBtnPress={(value) => {
              if (value === "customer") {
                navigation.push(ScreenNames.LicenseScreen, {
                  user: {
                    role: "business",
                  },
                });
                closeModal();
              } else if (value === "review") {
                setShowSearchScreen(true);
                closeModal();
              }
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default TabbarContainer;

const styles = StyleSheet.create({
  labelText: {
    fontSize: 13,
    fontFamily: CustomFonts.InterMedium,
    color: Colors.orangeColor,
    marginTop: -20,
  },
  image: {
    height: (28 / 930) * screenHeight,
    width: (28 / 930) * screenHeight,
    resizeMode: "contain",
  },
  modalContainer: {
    position: "absolute",
    bottom: 50, // Positioned just above the tab bar
    width: "100%",
    height: screenHeight * 0.65, // Limit height so it doesn't cover the tab bar
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "gray",
    shadowOffset: { height: 0, width: 4 },
    shadowOpacity: 0.4,
    alignItems: "center",
    paddingTop: 20,
    zIndex: 1, // Ensures the modal is on top of other elements
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#CCCCCC",
    borderRadius: 2.5,
    marginBottom: 10,
  },
});
