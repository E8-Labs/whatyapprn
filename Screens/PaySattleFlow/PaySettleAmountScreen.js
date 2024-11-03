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

const PaySettleAmountScreen = ({ navigation, route }) => {

    const review = route.params.review
    console.log('review', review)
    const [loading,setLoading] = useState(false)


    const handleContinuePress =async () => {
        navigation.push(ScreenNames.SettlementPaymentScreen,{
            review:review
        })
       
      }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading &&(
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
                        Review
                    </Text>
                    <View></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 30 / 930 * screenHeight, marginTop: 50 / 930 * screenHeight }}>
                    <Image source={{ uri: review.business.profile_image }}
                        style={{ height: 60 / 930 * screenHeight, width: 60 / 930 * screenHeight, resizeMode: 'cover', borderRadius: 30,marginTop:50 }}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'center' }}>
                        <Text style={[GlobalStyles.text17, { color: '#00000054' }]}>
                            From
                        </Text>
                        <Text style={[GlobalStyles.text17, { color: '#000000' }]}>
                            {review.business.name}
                        </Text>
                    </View>
                    <Text style={[GlobalStyles.text17, {}]}>
                        Settlement Offer
                    </Text>

                    <Text style={{fontSize:48,fontFamily:CustomFonts.IntriaBold}}>
                        ${review.settlementOfferObject&&review.settlementOfferObject.amount}
                    </Text>


                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                           handleContinuePress()
                        }}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Accept & Pay
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>

    )
}

export default PaySettleAmountScreen