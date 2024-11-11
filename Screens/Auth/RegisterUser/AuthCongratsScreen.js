import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../../res/Constants'
import { ScreenNames } from '../../../res/ScreenNames'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthCongratsScreen = ({ navigation, route }) => {
    const from = route.params.from

    const handleContinuePress = () => {
        if (from === 'PasswordScreen') {
            navigation.push(ScreenNames.UploadMediaScreen,{
                from:'congrats'
            })
        } else{
            navigation.push(ScreenNames.TabbarContainer,{
                from:'congratsScreen'
               })
        }

    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.container}>
                <View style={{
                    marginTop: 80 / 930 * screenHeight, width: screenWidth - 50, alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <Text style={[GlobalStyles.heading, { textAlign: 'center', }]}>
                        Congrats
                    </Text>
                    <Image source={require('../../../assets/Images/authCongratsImage.png')}
                        style={{ height: 200 / 930 * screenHeight, width: 300 / 430 * screenWidth, resizeMode: 'contain' }}
                    />

                    <Text style={[GlobalStyles.subheading14, { textAlign: 'center' }]}>
                        Account successfully created
                    </Text>

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                            handleContinuePress()
                        }}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AuthCongratsScreen