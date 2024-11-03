import { View, Text, Image, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScreenNames } from '../../res/ScreenNames'

export default function SplashScreen({ navigation }) {

    useEffect( () => {
       let timer = setTimeout(() => {
        getUserProfile()

       }, 1000);

       return ()=>clearTimeout(timer)

    }, [])

    const getUserProfile = async() => {
        let data = await AsyncStorage.getItem("USER")
        if (data) {
            let u = JSON.parse(data)
            navigation.push(ScreenNames.TabbarContainer,{
              
            })
        } else {
            navigation.push(ScreenNames.OnboardingSlideScreen)
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={{ height: screenHeight, width: screenWidth }}>
                <Image source={require('../../assets/Images/splashImage.png')}
                    style={{ height: screenHeight, width: screenWidth }}
                />
            </View>
        </SafeAreaView>
    )
}