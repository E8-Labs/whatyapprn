import React, { useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, Button, TouchableOpacity,Image } from "react-native";
import { WebView } from "react-native-webview";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";

const ResourcesMainScreen = () => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const handleBackPress = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const handleForwardPress = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: "https://www.whatyap.com/resources" }}
          startInLoadingState={true}
          onNavigationStateChange={handleNavigationStateChange}
          style={styles.webView}
        />
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            
            onPress={handleBackPress}
            disabled={!canGoBack}
          >
            <Image source = {require('../../assets/Images/backArrow.png')} 
              style = {GlobalStyles.image24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            title="Forward"
            onPress={handleForwardPress}
            disabled={!canGoForward}
          >
            <Image source={require('../../assets/Images/farwordArrow.png')} 
              style = {GlobalStyles.image24}
            />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:'#fff'
  },
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "lightgray",
  },
});

export default ResourcesMainScreen;