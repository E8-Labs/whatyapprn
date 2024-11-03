import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { ScreenNames } from '../../res/ScreenNames'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'

const SettlePayCongratsScreen = ({ navigation, route }) => {
    const status = route.params.status
    console.log('review  is', status)

    const handleContinuePress = async () => {
        navigation.pop(3)
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.container}>
                <Text style={[GlobalStyles.text14, { marginTop: 20 }]}>
                    Successful Payment
                </Text>
                <View style={{
                    marginTop: 60 / 930 * screenHeight, width: screenWidth - 50, alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                }}>


                    <Text style={[GlobalStyles.heading, { textAlign: 'center', }]}>
                        Congrats
                    </Text>
                    <Image source={status ? require('../../assets/Images/paySuccessImage.png') : require('../../assets/Images/payFailImage.png')}
                        style={{ height: 200 / 930 * screenHeight, width: 300 / 430 * screenWidth, resizeMode: 'contain' }}
                    />

                    <Text style={[GlobalStyles.subheading14, { textAlign: 'center', marginTop: 100 / 930 * screenHeight }]}>
                        Payment {status ? "Successful" : 'Failed'}
                    </Text>

                    {
                        status ? (
                            <TouchableOpacity style={GlobalStyles.capsuleBtn}
                                onPress={() => {
                                    handleContinuePress()
                                }}
                            >
                                <Text style={GlobalStyles.BtnText}>
                                    Return Home
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity style={GlobalStyles.capsuleBtn}
                                    onPress={() => {
                                        handleContinuePress()
                                    }}
                                >
                                    <Text style={GlobalStyles.BtnText}>
                                        Retry
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        handleContinuePress()
                                    }}
                                >
                                    <Text style={[GlobalStyles.BtnText,{color:'black',marginTop:20}]}>
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )
                    }


                </View>
            </View>
        </SafeAreaView>
    )
}

export default SettlePayCongratsScreen
