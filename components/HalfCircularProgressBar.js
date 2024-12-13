import React from 'react';
import { View, StyleSheet, Text,Image } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { screenHeight } from '../res/Constants';
import { CustomFonts } from '../assets/font/Fonts';
import { GlobalStyles } from '../assets/styles/GlobalStyles';

const HalfCircularProgress = ({ progress,type }) => {
  const strokeWidth = 15;
  const radius = 80; // Adjust this for the desired size
  const innerRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * innerRadius;
  const progressStroke = circumference * (progress / 100);

  return (
    <View style={styles.container}>
      <Svg
        height={radius * 2 + strokeWidth} // Adjust height to prevent cut-off
        width={radius * 2 + strokeWidth}  // Adjust width to prevent cut-off
        viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius + strokeWidth}`}
      >
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FF2626" /> 
            <Stop offset="40%" stopColor="#DDFF42" /> 
            <Stop offset="100%" stopColor="#00EE8A" />
          </LinearGradient>
        </Defs>
        {/* Background circle */}
        <Path
          d={`M ${strokeWidth / 2} ${radius + strokeWidth / 2} a ${innerRadius} ${innerRadius} 0 0 1 ${innerRadius * 2} 0`}
          stroke="#00EE8A20"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap='round'
        />
        {/* Progress path */}
        <Path
          d={`M ${strokeWidth / 2} ${radius + strokeWidth / 2} a ${innerRadius} ${innerRadius} 0 0 1 ${innerRadius * 2} 0`}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={[progressStroke, circumference]}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textContainer}>
       
        <Text style={styles.progressText}>{`${progress}`}</Text>
        {
            type === 'Yap' ? (
                <View style = {{flexDirection:'row',alignItems:'center',marginTop:6/930*screenHeight}}>
                    <Image source={require('../assets/Images/yIcon.png')}
                        style = {GlobalStyles.yIcon}
                    />
                    <Text style = {[GlobalStyles.text14,{color:'#00000090'}]}
                    >
                        ap score
                    </Text>
                </View>

            ):(
                <Text style = {[GlobalStyles.text14,{color:'#00000090',marginRight:8/430*screenHeight,marginTop:6/930*screenHeight}]}
                >
                    Sentiment Score
                </Text>
            )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf:'center'
    // backgroundColor:'red',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top:85/930*screenHeight
  },
  progressText: {
    fontSize: 24,
    fontFamily:CustomFonts.IntriaBold
    // fontWeight: 'bold',
  },
});

export default HalfCircularProgress;
