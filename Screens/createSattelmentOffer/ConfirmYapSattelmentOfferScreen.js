import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'
import { ShowMessage } from '../../components/ShowMessage'


const ConfirmYapSattelmentOfferScreen = ({ navigation, route }) => {

    const review = route.params.review
    console.log('review', review)

    const [loading,setLoading] = useState(false)

    const sendOffer = async () => {
        const data =await AsyncStorage.getItem("USER")

        if (data) {
            let u = JSON.parse(data)
            let apidata = {
                reviewId: review.id,
                settlementAmount: review.amount
            }
            console.log('apidata', apidata)
            // return

            try {
                setLoading(true)

                const response = await axios.post(Apipath.sendSettlementOffer,apidata, {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": 'Bearer ' + u.token
                    }
                })
                setLoading(false)
                if (response.data) {
                    if (response.data.status === true) {
                        console.log('send offer data is', response.data.data)
                        navigation.push(ScreenNames.YapSattelmentFinalScreen,{
                            review:review
                        })
                    } else {
                        ShowMessage(response.data.message)
                        console.log('send offer message is', response.data.message)
                    }
                }
            } catch (e) {
                setLoading(false)
                console.log('error in send offer api is', e)
            }

        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading&&(
                    <LoadingAnimation visible = {loading} />
                )
            }
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
                        Settlement Offer
                    </Text>
                    <TouchableOpacity>
                        <Image source={require('../../assets/Images/threeDotsImage.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight, marginTop: 50 / 930 * screenHeight }}>
                    <Image source={require('../../assets/Images/mainIcon.png')}
                        style={{ height: 39 / 930 * screenHeight, width: 45 / 930 * screenHeight, resizeMode: 'contain' }}
                    />
                    <Text style={[GlobalStyles.text17]}>
                        Confirm action
                    </Text>
                    <Text style={[GlobalStyles.heading, { textAlign: 'center' }]}>
                        ${review.amount}
                    </Text>
                    <Text style={[GlobalStyles.text17, { textAlign: 'center' }]}>
                        The above amount will be paid by the customer relating to this dispute
                    </Text>



                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                            sendOffer()
                        }}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Continue
                        </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 30 }}>
                        <Image source={require('../../assets/Images/alertIcon.png')}
                            style={[GlobalStyles.image24, { alignSelf: 'flex-start', }]}
                        />
                        <Text style={[GlobalStyles.text14, { width: 300 / 430 * screenWidth }]}>
                            You'll only be able to submit this settlement one time.
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>

    )
}

export default ConfirmYapSattelmentOfferScreen