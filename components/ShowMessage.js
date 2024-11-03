import Toast from 'react-native-root-toast';

export const ShowMessage = (message, backgroundColor = 'red',  textColor = 'white') => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      
      backgroundColor: backgroundColor,
      textColor: textColor,
      shadow: true,
      shadowColor:'grey',
      // opacity:1,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
