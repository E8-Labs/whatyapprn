import { View, Text, Image, SafeAreaView, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { screenHeight, screenWidth } from '../../res/Constants';
import { GlobalStyles } from '../../assets/styles/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenNames } from '../../res/ScreenNames';

export default function SplashScreen({ navigation }) {
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const scaleAnim3 = useRef(new Animated.Value(1)).current;
  const scaleAnim4 = useRef(new Animated.Value(1)).current;

  const circleImage1 = require('../../assets/Images/splashCircleImage1.png');
  const circleImage2 = require('../../assets/Images/splashCircleImage2.png');
  const circleImage3 = require('../../assets/Images/splashCircleImage3.png');

  useEffect(() => {
    // Function to create random scaling animations
    const createRandomScaleAnimation = (animation) => {
      const randomScaleToValue = 1 + Math.random() * 0.3; // Random scale between 1 and 1.3
      const randomDuration = 800 + Math.random() * 800; // Random duration between 800ms and 1600ms

      return Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: randomScaleToValue,
            duration: randomDuration,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: randomDuration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createRandomScaleAnimation(scaleAnim1);
    setTimeout(() => createRandomScaleAnimation(scaleAnim2), 200);
    setTimeout(() => createRandomScaleAnimation(scaleAnim3), 400);
    setTimeout(() => createRandomScaleAnimation(scaleAnim4), 600);

    // Timer to navigate after the splash screen
    const timer = setTimeout(() => {
      getUserProfile();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getUserProfile = async () => {
    let data = await AsyncStorage.getItem("USER");
    if (data) {
      let u = JSON.parse(data);
      // return
      if (u.user.role === "admin") {
        navigation.push(ScreenNames.AdminTabbarContainer);
      } else {
        navigation.push(ScreenNames.TabbarContainer,{
          from:'splashScreen'
         });
      }
    } else {
      navigation.push(ScreenNames.OnboardingSlideScreen);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={{ height: screenHeight, width: screenWidth, alignItems: 'center', justifyContent: 'center' }}>
        {/* Background Animated Circles */}
        <Animated.Image
          source={circleImage1}
          style={[
            styles.circle,
            { top: screenHeight * 0.01, left: screenWidth * 0.7, transform: [{ scale: scaleAnim1 }] ,height:50},
          ]}
        />
        <Animated.Image
          source={circleImage3}
          style={[
            styles.circle,
            { top: screenHeight * 0.6, left: screenWidth * 0.1, transform: [{ scale: scaleAnim2 }] },
          ]}
        />
        <Animated.Image
          source={circleImage1}
          style={[
            styles.circle,
            { top: screenHeight * 0.20, left: screenWidth * 0.1, transform: [{ scale: scaleAnim3 }] },
          ]}
        />
        <Animated.Image
          source={circleImage1}
          style={[
            styles.circle,
            { bottom: screenHeight * 0.1, left: screenWidth * 0.6, transform: [{ scale: scaleAnim4 }] },
          ]}
        />

        {/* Center Logo and Loading Text */}
        <Image
          source={require('../../assets/Images/logo.png')}
          style={{ width: screenWidth * 0.6, height: 58, resizeMode: 'contain' }}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    // opacity: 0.7,
    resizeMode:'contain'
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
};
