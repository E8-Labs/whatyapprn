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
import ReviewsMainScreen from "../ReviewsFlow/ReviewsMainScreen";
import ResoursesMainScreen from "../ResourcesFlow/ResoursesMainScreen";
import AddReviewMainScreen from "../AddReviewFlow/AddReviewMainScreen";
import SearchScreen from "../DiscoverFlow/SearchScreen";
import ProfileStackScreen from "../../components/ProfileStackScreen";
import { Colors } from "../../res/Colors";
import { CustomFonts } from "../../assets/font/Fonts";
import { placeholderImage, screenHeight, screenWidth } from "../../res/Constants";
import { ScreenNames } from "../../res/ScreenNames";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [hasNavigatedToPlans, setHasNavigatedToPlans] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [hasCheckedRoleOnce, setHasCheckedRoleOnce] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [loadImage, setLoadImage] = useState(false);
  const from = route.params.from;
  const RevenueCatApiKey = ApiKeys.RevenueCatApiKey;

  useEffect(() => {
    if (user) {
      Purchases.configure({
        apiKey: RevenueCatApiKey,
        appUserID: `${user?.id}`,
      });
    }
  }, [user]);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: screenHeight * 0.4,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    getNotificationPermission();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return null;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) throw new Error("Expo Project ID is missing.");

      token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      await updateProfile({ fcm_token: token });
    } catch (error) {
      console.error("Error retrieving FCM token:", error);
      token = `${error}`;
    }

    return token;
  }

  const getNotificationPermission = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      await updateProfile({ fcm_token: token });
    }
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("UpdateProfile", () => {
      setHasCheckedRoleOnce(false);
      checkUserRole();
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      // checkUserRole();
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      checkUserRole();
    }, [])
  );

  const checkUserRole = async () => {
    if (isCheckingRole || hasCheckedRoleOnce) return;

    setIsCheckingRole(true);
    try {
      const data = await AsyncStorage.getItem("USER");
      if (data) {
        const d = await getProfile();
        d.from = "tabbar";
        setUser(d);
        setRole(d.role);
        console.log('d.role', d.role)
        setHasCheckedRoleOnce(true);
      }
    } catch (err) {
      console.error("Error checking user role:", err);
    } finally {
      setIsCheckingRole(false);
    }
  };

  const checkSubscriptionStatus = (info,role) => {
   if (typeof info.entitlements.active["premium"] !== "undefined") {
      console.log(
        "User subscribed to plan Tabbar",
        info.entitlements.active["premium"]
      );
    } else {
      console.log("User not subscribed",role);
      if (
        role&&role == "business" 
       //&& Device.isDevice // it was added to prevent subscription not enable issue. by using this there is no need to comment scubscriotion screen for testing or development
      ) {
        console.log("Navigating to Plans");
        navigation.navigate(ScreenNames.PlansScreen);
      }
    }
  }

  useEffect(() => {
    if (!user || !user.role) return;
    const setupSubscriptionListener = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        checkSubscriptionStatus(customerInfo,user?.role);

        Purchases.addCustomerInfoUpdateListener((info) => {
          checkSubscriptionStatus(info,user?.role);
        });
      } catch (e) {
        console.error("Error fetching customer info", e);
      }
    };

    setupSubscriptionListener();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(); // Clean up
    };
  }, [user]);

  return (
    <View style={{ flex: 1, zIndex: 0 }}>
      {showSearchScreen ? (
        <SearchScreen
          hideAnimation={() => setShowSearchScreen(false)}
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
              component={DiscoverMainScreeen}
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
                focused ? <Text style={styles.labelText}>Resources</Text> : "",
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
                  />
                </>
              ),
              tabBarLabel: ({ focused }) =>
                focused ? <Text style={styles.labelText}>Profile</Text> : "",
            }}
          >
            {() => (
              <ProfileStackScreen
                user={user}
                role={role}
                from="tabbar"
                setUser={setUser}
                setRole={setRole}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      )}

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
                  user: { role: "business" },
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
    bottom: 50,
    width: "100%",
    height: screenHeight * 0.65,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "gray",
    shadowOffset: { height: 0, width: 4 },
    shadowOpacity: 0.4,
    alignItems: "center",
    paddingTop: 20,
    zIndex: 1,
  },
});
