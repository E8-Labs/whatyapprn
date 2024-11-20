import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';

const TestFile = () => {
  const topOpacity = useRef(new Animated.Value(1)).current;
  const middleOpacity = useRef(new Animated.Value(0.5)).current;
  const bottomOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animateSequence = () => {
      Animated.sequence([
        // Top bar brightens, others dim
        Animated.parallel([
          Animated.timing(topOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(middleOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bottomOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Middle bar brightens, others dim
        Animated.parallel([
          Animated.timing(topOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(middleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bottomOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Bottom bar brightens, others dim
        Animated.parallel([
          Animated.timing(topOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(middleOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bottomOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Repeat the sequence
        animateSequence();
      });
    };

    animateSequence();
  }, [topOpacity, middleOpacity, bottomOpacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./assets/Images/top.png')}
        style={[styles.bar, { opacity: topOpacity }]}
      />
      <Animated.Image
        source={require('./assets/Images/middle.png')}
        style={[styles.bar, { opacity: middleOpacity }]}
      />
      <Animated.Image
        source={require('./assets/Images/bottom.png')}
        style={[styles.bar, { opacity: bottomOpacity }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  bar: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    // marginVertical: 5,
    // backgroundColor:'red'
  },
});

export default TestFile;
