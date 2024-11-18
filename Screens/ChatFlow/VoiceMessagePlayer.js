import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Colors } from "../../res/Colors";
const VoiceMessagePlayer = ({ item, timestamp, user }) => {
  console.log("item", item);
  console.log(`item id ${item.item.id} anmd user id ${user.user.id}`);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playPauseAudio = async () => {
    if (!item.item.voice) {
      console.error("Audio URI is null or undefined");
      return;
    }

    try {
      console.log("Trying to play audio ", item.item.voice);
      if (isPlaying) {
        console.log("Already playing");
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        console.log("Not already playing");
        setIsLoading(true);
        let uri = item.item.voice;
        const { sound: newSound, status } = await Audio.Sound.createAsync({
          uri,
        });
        setSound(newSound);
        setIsPlaying(true);
        setIsLoading(false);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setCurrentPosition(0);
            Animated.timing(progress, {
              toValue: 0,
              duration: 0,
              useNativeDriver: false,
            }).start();
          } else {
            setCurrentPosition(status.positionMillis);
            setDuration(status.durationMillis);
            Animated.timing(progress, {
              toValue: status.positionMillis / status.durationMillis,
              duration: 100,
              useNativeDriver: false,
            }).start();
          }
        });

        await newSound.playAsync();
      }
    } catch (error) {
      console.error("Error playing audio", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Duration : ", duration);
    if (isPlaying) {
      Animated.timing(progress, {
        toValue: currentPosition / duration,
        duration: duration * 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [currentPosition, duration, isPlaying, progress]);

  return (
    <View
      style={[
        styles.container,
        { marginLeft: user.user.id === item.item.user.id ? "25%" : "2%" },
      ]}
    >
      <TouchableOpacity onPress={playPauseAudio} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.orangeColor} />
        ) : (
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color={Colors.orangeColor}
          />
        )}
      </TouchableOpacity>
      <View style={styles.waveformContainer}>
        <Animated.View
          style={[
            styles.waveform,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {user.user.id === item.item.user.id ? (
        <>
          <View style={styles.rightArrow}></View>
          <View style={styles.rightArrowOverlap}></View>
        </>
      ) : (
        <>
          <View style={styles.leftArrow}></View>
          <View style={styles.leftArrowOverlap}></View>
        </>
      )}

      {/* <View style={styles.leftArrow}></View>
            <View style={styles.leftArrowOverlap}></View> */}
      <Text style={styles.timestamp}>{moment(timestamp).format("h:mm a")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    marginVertical: 5,
    width: "70%",
    marginLeft: "2%",
    marginTop: 10,
  },
  waveformContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  waveform: {
    height: "100%",
    backgroundColor: Colors.orangeColor,
  },
  timestamp: {
    color: "#555",
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "white",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },
  leftArrow: {
    position: "absolute",
    backgroundColor: "#F5F5F5",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },
  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#fff",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
});

export default VoiceMessagePlayer;
