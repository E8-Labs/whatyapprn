import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { GlobalStyles } from '../../assets/styles/GlobalStyles';

const ResoursesMainScreen = () => {
  return (
    // <SafeAreaView style ={GlobalStyles.container}>
      <View style={[styles.container,{}]}>
        <WebView
          source={{ uri: 'https://www.whatyap.com/resources' }} // Replace with your desired URL
          startInLoadingState={true}
          style={{ flex: 1,marginTop:20 }}
        />
      </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ResoursesMainScreen;
