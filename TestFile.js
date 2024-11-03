import React from 'react';
import { View, StyleSheet } from 'react-native';
import HalfCircularProgress from './components/HalfCircularProgressBar';

const TestFile = () => {
  return (
    <View style={styles.container}>
     <HalfCircularProgress progress={100} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestFile;
