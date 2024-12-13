import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'


const CustomerNameScreen = ({ navigation, route }) => {


    const user = route.params.user
    console.log('user on name screen ', user)
    
    let n = user.licenseDetails ? user.licenseDetails.name : ""

    const [name, setName] = useState(n !== "Name not found" ? n : '')

    user.name = name


    const handleContinuePress = () => {

        navigation.push(ScreenNames.CustomerEmailScreen, {
            user: user
        })

    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.container}>
                <View style={GlobalStyles.completeProfileTopBar}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Image source={require('../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>

                    <Text style={GlobalStyles.text14}>
                        New Customer
                    </Text>
                    <View></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        Full name
                    </Text>

                    <TextInput
                        placeholder='Enter Name'
                        value={name}
                        onChangeText={(text) => {
                            setName(text)
                        }}
                        placeholderTextColor={'black'}
                        style={GlobalStyles.input}
                    />

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

export default CustomerNameScreen