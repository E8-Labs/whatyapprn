import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'
import formatAmount from '../../res/FormateAmount'


const YapSattelmentFinalScreen = ({ navigation,route }) => {
    const review = route.params.review
console.log('review', review)
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
                        Settle
                    </Text>
                    <View></View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, marginTop: 150 / 930 * screenHeight, alignSelf: 'center', justifyContent: 'center' }}>
                    <Image source={review.business.profile_image?{uri:review.business.profile_image}:placeholderImage}
                        style={{ height: 58 / 930 * screenHeight, width: 58 / 930 * screenHeight, resizeMode: 'contain', borderRadius: 30 }}
                    />
                    <Image source={review.customer.profile_image?{uri:review.customer.profile_image}:placeholderImage}
                        style={{
                            height: 50 / 930 * screenHeight, width: 50 / 930 * screenHeight, resizeMode: 'cover', marginLeft: -10 / 430 * screenHeight,
                            borderRadius: 30
                        }}
                    />
                    <Image source={require('../../assets/Images/greenSentIcon.png')}
                        style={[GlobalStyles.image24, { alignSelf: 'flex-end', marginLeft: -20 / 430 * screenWidth }]}
                    />
                </View>

                <Text style={[GlobalStyles.heading, { textAlign: 'center' }]}>
                    Sent
                </Text>

                <Text style = {[GlobalStyles.text17,{textAlign:'center',marginTop:20}]}>
                    Your settlement offer of ${formatAmount(review.amount)} was sent to {review.customer.name}
                </Text>


                <TouchableOpacity style={GlobalStyles.capsuleBtn}
                    onPress={() => {
                        ShowMessage("Congrates! Offer sent",Colors.orangeColor)
                        navigation.pop(3)
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