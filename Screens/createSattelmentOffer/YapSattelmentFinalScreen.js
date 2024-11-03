import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'


const YapSattelmentFinalScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={[GlobalStyles.container]}>
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
                        Sattle
                    </Text>
                    <View></View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, marginTop: 150 / 930 * screenHeight, alignSelf: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/Images/profileImage.png')}
                        style={{ height: 58 / 930 * screenHeight, width: 58 / 930 * screenHeight, resizeMode: 'contain', borderRadius: 30 }}
                    />
                    <Image source={require('../../assets/Images/profileImage2.png')}
                        style={{
                            height: 58 / 930 * screenHeight, width: 58 / 430 * screenHeight, resizeMode: 'contain', marginLeft: -25 / 430 * screenHeight,
                            //borderWidth:2,borderColor:'red',
                            borderRadius: 30
                        }}
                    />
                    <Image source={require('../../assets/Images/greenSentIcon.png')}
                        style={[GlobalStyles.image24, { alignSelf: 'flex-end', marginLeft: -60 / 430 * screenWidth }]}
                    />
                </View>

                <Text style={[GlobalStyles.heading, { textAlign: 'center' }]}>
                    Sent
                </Text>

                <Text style = {[GlobalStyles.text17,{textAlign:'center',marginTop:20}]}>
                    Your settlement offer of (amount ) was sent to  (customer name)
                </Text>


                <TouchableOpacity style={GlobalStyles.capsuleBtn}
                    onPress={() => {
                        navigation.push(ScreenNames.YapExperienceScreen)
                    }}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Continue
                    </Text>
                </TouchableOpacity>

                
            </View>
        </SafeAreaView>

    )
}

export default YapSattelmentFinalScreen