import "react-native-get-random-values";

import { StyleSheet, Text, View, SafeAreaView, AppState } from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingSlideScreen from "./Screens/OnboardingFlow/OnboardingSlideScreen";
import { ScreenNames } from "./res/ScreenNames";
import { useFonts } from "expo-font";
import LoginScreen from "./Screens/Auth/LoginScreen";
import VerifyEmail from "./Screens/Auth/RegisterUser/VerifyEmail";
import EmailScreen from "./Screens/Auth/RegisterUser/EmailScreen";
import UploadImageScreen from "./Screens/Auth/RegisterUser/UploadImageScreen";
import PasswordScreen from "./Screens/Auth/RegisterUser/PasswordScreen";
import AuthCongratsScreen from "./Screens/Auth/RegisterUser/AuthCongratsScreen";
import BusinessIndustryScreen from "./Screens/ProfileSetup/BusinessIndustryScreen";
import EmployeesScreen from "./Screens/ProfileSetup/EmployeesScreen";
import BusinessLocation from "./Screens/ProfileSetup/BusinessLocation";
import BusinessDetailsScreen from "./Screens/ProfileSetup/BusinessDetailsScreen";
import NotificationPermitionScreeen from "./Screens/ProfileSetup/NotificationPermitionScreeen";
import LocationPremitionScreen from "./Screens/ProfileSetup/LocationPermitionScreen";
import PlansScreen from "./Screens/ProfileSetup/PlansScreen";
import UloadMediaScreen from "./Screens/ProfileSetup/UploadMediaScreen";
import UploadMediaScreen from "./Screens/ProfileSetup/UploadMediaScreen";
import ProfileCongratsScreen from "./Screens/ProfileSetup/ProfileCongratsScreen";
import TabbarContainer from "./Screens/Tabbar/TabbarContainer";
import TestFile from "./TestFile";
import AllCustomersScreen from "./Screens/DiscoverFlow/AllCustomersScreen";
import LicenseScreen from "./Screens/AddNewCustomer/LicenseScreen";
import CustomerNameScreen from "./Screens/AddNewCustomer/CustomerNameScreen";
import CustomerEmailScreen from "./Screens/AddNewCustomer/CustomerEmailScreen";
import YapServiceScreen from "./Screens/AddReviewFlow/YapServiceScreen";
import YapTransactionAmountScreen from "./Screens/AddReviewFlow/YapTransactionAmountScreen";
import YapTransactionDate from "./Screens/AddReviewFlow/YapTransactionDate";
import YapMediaUploadScreen from "./Screens/AddReviewFlow/YapMediaUploadeScreen";
import YapScoreScreen from "./Screens/AddReviewFlow/YapScoreScreen";
import SattelmentSelectionScreen from "./Screens/AddReviewFlow/SattelmentSelectionScreen";
import SattlementAmountScreen from "./Screens/AddReviewFlow/SattelmentAmountScreen";
import YapExperienceScreen from "./Screens/AddReviewFlow/YapExperienceScreen";
import ReviewDetailsScreen from "./Screens/ReviewsFlow/ReviewDetailsScreen";
import ReviewReplyScreen from "./Screens/ReviewsFlow/ReviewReplyScreen";
import CustomerProfileDetails from "./Screens/ProfileFlow/CustomerProfileDetails";
import YapSattelmentAmount from "./Screens/createSattelmentOffer/YapSattlementAmount";
import ConfirmYapSattelmentOfferScreen from "./Screens/createSattelmentOffer/ConfirmYapSattelmentOfferScreen";
import YapSattelmentFinalScreen from "./Screens/createSattelmentOffer/YapSattelmentFinalScreen";
import BusinessWebScreen from "./Screens/Auth/RegisterUser/BusinessWebScreen";
import SplashScreen from "./Screens/OnboardingFlow/SplashScreen";
import Testfile2 from "./Testfile2";
import MessagesListScreen from "./Screens/ChatFlow/MessagesListScreen";
import ChatScreen from "./Screens/ChatFlow/ChatScreen";
import ResourcesDetailScreen from "./Screens/ResourcesFlow/ResourcesDetailScreen";
import NotificationsScreen from "./Screens/NotificationsFlow/NotificationsScreen";
import RoleSelectionScreen from "./Screens/OnboardingFlow/RoleSelectionScreen";
import LicenseDetailsScreen from "./Screens/ProfileSetup/LicenseDetailsScreen";
import BusinessInfoScreen from "./Screens/ProfileFlow/BusinessInfoScreen";
import ProfilePlansScreen from "./Screens/ProfileFlow/ProfilePlansScreen";
import BuyCreditScreen from "./Screens/ProfileFlow/BuyCreditScreen";
import MyWalletScreen from "./Screens/Wallet/MyWalletScreen";
import DisputeScreen from "./Screens/ReviewsFlow/DisputeScreen";
import SettleReviewDetailsScreen from "./Screens/PaySattleFlow/SettleReviewDetailsScreen";
import PaySettleAmountScreen from "./Screens/PaySattleFlow/PaySettleAmountScreen";
import SettlePayCongratsScreen from "./Screens/PaySattleFlow/SettlePayCongratsScreen";
import SettlementPaymentScreen from "./Screens/PaySattleFlow/SettlementPaymentScreen";
import AdminTabbarContainer from "./Screens/AdminFlow/Tabbar/AdminTabbarContainer";

import socket from "./Api/socket";
import AdminUserMainScreen from "./Screens/AdminFlow/UsersFlow/AdminUserMainScreen";
import AdminBusinessProfileDetailsScreen from "./Screens/ProfileFlow/AdminBusinessProfileDetailsScreen";
import AddCardScreen from "./Screens/PaySattleFlow/AddCardScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [loaded, error] = useFonts({
    InterBold: require("./assets/font/Inter/static/Inter_18pt-Bold.ttf"),
    InterExtraBold: require("./assets/font/Inter/static/Inter_18pt-ExtraBold.ttf"),
    InterMedium: require("./assets/font/Inter/static/Inter_18pt-Medium.ttf"),
    InterRegular: require("./assets/font/Inter/static/Inter_18pt-Regular.ttf"),
    InterSemibold: require("./assets/font/Inter/static/Inter_18pt-SemiBold.ttf"),
    InterLight: require("./assets/font/Inter/static/Inter_18pt-Light.ttf"),
    PoppinsBold: require("./assets/font/Poppins/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("./assets/font/Poppins/Poppins-ExtraBold.ttf"),
    PoppinsMedium: require("./assets/font/Poppins/Poppins-Medium.ttf"),
    PoppinsRegular: require("./assets/font/Poppins/Poppins-Regular.ttf"),
    PoppinsLight: require("./assets/font/Poppins/Poppins-Light.ttf"),
    PoppinsSeminBold: require("./assets/font/Poppins/Poppins-SemiBold.ttf"),
    IntriaSansRegular: require("./assets/font/Intria-sans/InriaSans-Regular.ttf"),
    IntriaSansBold: require("./assets/font/Intria-sans/InriaSans-Bold.ttf"),
  });

  useEffect(() => {
    // Connect the socket initially
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground
        if (!socket.connected) {
          console.log("Reconnecting socket on app foreground");
          socket.connect();
        }
      }
      setAppState(nextAppState);
    };

    // Monitor app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    if (loaded || error) {
      <Text>Loading fonts......</Text>;
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    console.log("fonts are loaded");
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ScreenNames.SplashScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={ScreenNames.SplashScreen}
          component={SplashScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.OnboardingSlideScreen}
          component={OnboardingSlideScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.RoleSelectionScreen}
          component={RoleSelectionScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.LoginScreen}
          component={LoginScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.EmailScreen}
          component={EmailScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.VerifyEmail}
          component={VerifyEmail}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.UploadImageScreen}
          component={UploadImageScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.PasswordScreen}
          component={PasswordScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.AuthCongratsScreen}
          component={AuthCongratsScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.UploadMediaScreen}
          component={UploadMediaScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.BusinessIndustryScreen}
          component={BusinessIndustryScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.EmployeesScreen}
          component={EmployeesScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.BusinessLocation}
          component={BusinessLocation}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.BusinessDetailsScreen}
          component={BusinessDetailsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.NotificationPermitionScreeen}
          component={NotificationPermitionScreeen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.LocationPremitionScreen}
          component={LocationPremitionScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.PlansScreen}
          component={PlansScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.ProfileCongratsScreen}
          component={ProfileCongratsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.BusinessWebScreen}
          component={BusinessWebScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.TabbarContainer}
          component={TabbarContainer}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.AllCustomersScreen}
          component={AllCustomersScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.LicenseScreen}
          component={LicenseScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.CustomerNameScreen}
          component={CustomerNameScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.LicenseDetailsScreen}
          component={LicenseDetailsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.CustomerEmailScreen}
          component={CustomerEmailScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.YapServiceScreen}
          component={YapServiceScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapTransactionAmountScreen}
          component={YapTransactionAmountScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapTransactionDate}
          component={YapTransactionDate}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapMediaUploadScreen}
          component={YapMediaUploadScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapScoreScreen}
          component={YapScoreScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.SattelmentSelectionScreen}
          component={SattelmentSelectionScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.SattlementAmountScreen}
          component={SattlementAmountScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapExperienceScreen}
          component={YapExperienceScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.ReviewDetailsScreen}
          component={ReviewDetailsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.ReviewReplyScreen}
          component={ReviewReplyScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.CustomerProfileDetails}
          component={CustomerProfileDetails}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapSattelmentAmount}
          component={YapSattelmentAmount}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.ConfirmYapSattelmentOfferScreen}
          component={ConfirmYapSattelmentOfferScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.YapSattelmentFinalScreen}
          component={YapSattelmentFinalScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.MessagesListScreen}
          component={MessagesListScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.ChatScreen}
          component={ChatScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.ResourcesDetailScreen}
          component={ResourcesDetailScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.BusinessInfoScreen}
          component={BusinessInfoScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.NotificationsScreen}
          component={NotificationsScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.ProfilePlansScreen}
          component={ProfilePlansScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.BuyCreditScreen}
          component={BuyCreditScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.DisputeScreen}
          component={DisputeScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.MyWalletScreen}
          component={MyWalletScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.SettleReviewDetailsScreen}
          component={SettleReviewDetailsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.PaySettleAmountScreen}
          component={PaySettleAmountScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.SettlePayCongratsScreen}
          component={SettlePayCongratsScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.SettlementPaymentScreen}
          component={SettlementPaymentScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.AdminTabbarContainer}
          component={AdminTabbarContainer}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.TestFile}
          component={TestFile}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.Testfile2}
          component={Testfile2}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={ScreenNames.AdminBusinessProfileDetailsScreen}
          component={AdminBusinessProfileDetailsScreen}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenNames.AddCardScreen}
          component={AddCardScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
