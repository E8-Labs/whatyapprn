import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { screenHeight, screenWidth } from '../res/Constants';

const LoadingAnimation = ({ visible }) => {
  const topOpacity = useRef(new Animated.Value(1)).current;
  const middleOpacity = useRef(new Animated.Value(0.5)).current;
  const bottomOpacity = useRef(new Animated.Value(0.5)).current;
  const animationRunning = useRef(false);

  useEffect(() => {
    const animateSequence = () => {
      if (!visible || animationRunning.current) {
        return; // Stop the animation if not visible or already running
      }

      animationRunning.current = true;

      Animated.loop(
        Animated.sequence([
          // Top bar brightens, others dim
          Animated.parallel([
            Animated.timing(topOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(middleOpacity, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(bottomOpacity, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          // Middle bar brightens, others dim
          Animated.parallel([
            Animated.timing(topOpacity, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(middleOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(bottomOpacity, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          // Bottom bar brightens, others dim
          Animated.parallel([
            Animated.timing(topOpacity, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(middleOpacity, {
              toValue: 0.5,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(bottomOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    const stopAnimation = () => {
      Animated.timing(topOpacity).stop();
      Animated.timing(middleOpacity).stop();
      Animated.timing(bottomOpacity).stop();
      animationRunning.current = false;
    };

    if (visible) {
      animateSequence();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [visible, topOpacity, middleOpacity, bottomOpacity]);

  return (
    visible && (
      <View style={styles.overlay}>
        <View style={styles.container}>
        <Animated.Image
          source={require('../assets/Images/top.png')}
          style={[styles.bar, { opacity: topOpacity }]}
        />
        <Animated.Image
          source={require('../assets/Images/middle.png')}
          style={[styles.bar, { opacity: middleOpacity }]}
        />
        <Animated.Image
          source={require('../assets/Images/bottom.png')}
          style={[styles.bar, { opacity: bottomOpacity }]}
        />
      </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000080', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure it is above all other components
  },
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bar: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
});

export default LoadingAnimation;
