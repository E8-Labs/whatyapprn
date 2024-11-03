import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { CustomFonts } from '../assets/font/Fonts';
export default function LoadingAnimation({visible = false}) {
  // useEffect(() => {
  //   setInterval(() => {
  //     setVisible(!visible);
  //   }, 2000);
  // }, []);

  return (
    <View style = {{backgroundColor:'red'}}>
      <AnimatedLoader
        source={require('../assets/loadingAnimation/loadingAnimation.json')}
        visible={visible}
        overlayColor="rgba(255,255,255,0.80)"
        animationStyle={styles.lottie}
        // animationType= ""
        speed={2}>
        <Text style={{ fontSize: 22,fontFamily:CustomFonts.IntriaBold }}>Loading.....</Text>
      </AnimatedLoader>
      </View>
  );
}
const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 150,
  },
});