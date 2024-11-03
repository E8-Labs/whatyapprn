import { View, Text, SafeAreaView,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'

import { screenHeight,screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'


const AdminDashboardMainScreen = () => {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.container}>
        <View style={{
          width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 20 / 930 * screenHeight
        }}>
          <Image source={require('../../../assets/Images/logo.png')}
            style={GlobalStyles.logoImage}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.MessagesListScreen)
              }}
            >
              <Image source={require('../../../assets/Images/messageIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.NotificationsScreen)
              }}
            >
              <Image source={require('../../../assets/Images/notificationIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default AdminDashboardMainScreen