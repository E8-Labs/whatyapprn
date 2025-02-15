import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import {
  placeholderImage,
  screenHeight,
  screenWidth,
} from "../../res/Constants";
import { CustomFonts } from "../../assets/font/Fonts";
import { Colors } from "../../res/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenNames } from "../../res/ScreenNames";
import * as Progress from "react-native-progress";
import { getProfile } from "../../components/GetProfile";
import { useFocusEffect } from "@react-navigation/native";

import Mailer from 'react-native-mail';


const ProfileMainScreen = ({ navigation }) => {
  const [user, setUser] = useState("");

  const logoutUser = () => {
    AsyncStorage.removeItem("USER");
    navigation.replace(ScreenNames.LoginScreen);
  };
  useFocusEffect(
    React.useCallback(() => {
      const getUserProfile = async () => {
        let user = await getProfile();
        console.log("user profile on profile main screen is", user);
        setUser(user);
      };

      getUserProfile();
    }, [])
  );

  const handleEmail = () => {
    Mailer.mail(
      {
        subject: 'Hello from React Native',
        recipients: ['feedback@whatyap.com'], // Array of email addresses
        ccRecipients: ['cc@example.com'], // Array of CC email addresses
        bccRecipients: ['bcc@example.com'], // Array of BCC email addresses
        body: 'This is a test email from React Native.',
        isHTML: true, // Set to `true` if the email body contains HTML
        attachment: {
          path: '', // Path to the file (optional)
          type: '', // MIME type (optional, e.g., `pdf`, `image/jpeg`)
          name: '', // File name (optional)
        },
      },
      (error, event) => {
        if (error) {
          Alert.alert('Error', 'Could not send mail.');
          console.log('error in email sending', error)
        } else {
          Alert.alert('Success', 'Your email was sent!');
        }
      }
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View
        style={{
          gap: (20 / 930) * screenHeight,
          width: screenWidth - 40,
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: screenWidth - 40 }}>
          <Text style={[GlobalStyles.heading,{width:screenWidth-100}]}>My Profile</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.MessagesListScreen)
              }}
            >
              <Image
                source={require("../../assets/Images/messageIcon.png")}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              navigation.push(ScreenNames.MyWalletScreen)
            }}>
              <Image
                source={require("../../assets/Images/walletIcon.png")}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: (15 / 430) * screenWidth,
          }}
        >
          <Image
            source={
              user && user.profile_image
                ? { uri: user.profile_image }
                : placeholderImage
            }
            style={{
              height: (84 / 930) * screenHeight,
              width: (84 / 930) * screenHeight,
              resizeMode: "cover",
              borderRadius: 50,
            }}
          />
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: (5 / 930) * screenHeight,
            }}
          >
            <Text
              style={{ fontSize: 24, fontFamily: CustomFonts.InterSemibold }}
            >
              {user && user.name}
            </Text>

            <Text style={[GlobalStyles.text14, { color: "#00000090" }]}>
              {user && user.email}
            </Text>

            <Text style={[GlobalStyles.text14, { color: "#00000090" }]}>
              {user && user.business_website}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: screenWidth - 40,
            alignItems: "flex-start",
            padding: 13,
            borderRadius: 10,
            backgroundColor: Colors.lightGray,
            gap: (8 / 930) * screenHeight,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: screenWidth - 80,
            }}
          >
            <Text style={[GlobalStyles.text17, { color: '#000' }]}>Credit Points</Text>

            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.orangeColor,
              }}
              onPress={() => {
                navigation.push(ScreenNames.BuyCreditScreen);
              }}
            >
              <Text style={[GlobalStyles.text14, { color: "white" }]}>
                Buy More
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={GlobalStyles.text}>
            {user ? user.credits_available : 0} credit points available
          </Text>

          <Progress.Bar
            style={{ marginTop: 10 }}
            progress={user ? user.credits_available / 100 : 0}
            width={350}
            unfilledColor="#FF570020"
            borderWidth={0}
            color={Colors.orangeColor}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.push(ScreenNames.BusinessInfoScreen, {
              user: user,
              from: "Business",
            });
          }}
        >
          <View
            style={[
              styles.btnContainer,
              { marginTop: (30 / 930) * screenHeight },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: (8 / 430) * screenWidth,
              }}
            >
              <Image
                source={
                  user && user.profile_image
                    ? { uri: user.profile_image }
                    : placeholderImage
                }
                style={[GlobalStyles.image24, { borderRadius: 24 }]}
              />
              <Text style={[GlobalStyles.text17, { color: '#000' }]}>Business Information</Text>
            </View>

            <Image
              source={require("../../assets/Images/farwordArrow.png")}
              style={GlobalStyles.image24}
            />
          </View>
        </TouchableOpacity>

        <View style={[GlobalStyles.divider, { marginTop: 0 }]}></View>

        <TouchableOpacity
          onPress={() => {
            navigation.push(ScreenNames.ProfilePlansScreen);
          }}
        >
          <View style={styles.btnContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: (8 / 430) * screenWidth,
              }}
            >
              <Image
                source={require("../../assets/Images/walletIcon.png")}
                style={GlobalStyles.image24}
              />
              <Text style={[GlobalStyles.text17, { color: '#000' }]}>Plans</Text>
            </View>

            <Image
              source={require("../../assets/Images/farwordArrow.png")}
              style={GlobalStyles.image24}
            />
          </View>
        </TouchableOpacity>

        <View style={[GlobalStyles.divider, { marginTop: 0 }]}></View>

        <TouchableOpacity>
          <View style={styles.btnContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: (8 / 430) * screenWidth,
              }}
            >
              <Image
                source={require("../../assets/Images/lockIcon.png")}
                style={GlobalStyles.image24}
              />
              <Text style={[GlobalStyles.text17, { color: '#000' }]}>Privacy Policy</Text>
            </View>

            <Image
              source={require("../../assets/Images/farwordArrow.png")}
              style={GlobalStyles.image24}
            />
          </View>
        </TouchableOpacity>



        <View style={[GlobalStyles.divider, { marginTop: 0 }]}></View>


        <TouchableOpacity>
          <View style={styles.btnContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: (8 / 430) * screenWidth,
              }}
            >
              <Image
                source={require("../../assets/Images/lockIcon.png")}
                style={GlobalStyles.image24}
              />
              <Text style={[GlobalStyles.text17, { color: '#000' }]}>Terms and Condition</Text>
            </View>

            <Image
              source={require("../../assets/Images/farwordArrow.png")}
              style={GlobalStyles.image24}
            />
          </View>
        </TouchableOpacity>



        <View style={[GlobalStyles.divider, { marginTop: 0 }]}></View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: screenWidth - 40,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={logoutUser}>
            <Text style={[GlobalStyles.text17, { color: "#E33636" }]}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEmail}
          >
            <Text style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>
              Send Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileMainScreen;

const styles = StyleSheet.create({
  btnContainer: {
    marginTop: (10 / 930) * screenHeight,
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth - 40,
    justifyContent: "space-between",
  },
});
