import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HalfCircularProgressBar = ({ 
  size = 300, 
  strokeWidth = 15, 
  progress = 75, 
  duration = 1000,
  score = 300, 
  label = "Yap score" 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Radius and circumference calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle circumference
  const halfCircle = size / 2;
  const rotationAngle = -135; // Adjust rotation angle for correct starting position

  // Animation effect
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  // Interpolation for stroke offset based on progress
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="red" />
            <Stop offset="50%" stopColor="yellow" />
            <Stop offset="100%" stopColor="green" />
          </LinearGradient>
        </Defs>
        <G rotation={rotationAngle} origin={`${halfCircle}, ${halfCircle}`}>
          {/* Background Circle */}
          <Circle
            stroke="#e6e6e6"
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference}, ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            stroke="url(#grad)"
            cx={halfCircle}
            cy={halfCircle}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circumference}, ${circumference}`}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: '30%',
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  labelText: {
    fontSize: 20,
    color: '#666',
  },
});

export default HalfCircularProgressBar;
