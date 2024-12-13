import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import formatAmount from '../../res/FormateAmount'


const YapSattelmentAmount = ({ navigation, route }) => {

    const [amount, setAmount] = useState(null)

    const review = route.params.review
    review.amount = amount

    console.log('review on yap settlement amount screen', review)

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
                        Settlement Offer
                    </Text>
                    <TouchableOpacity>
                        <Image source={require('../../assets/Images/threeDotsImage.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight, marginTop: 50 / 930 * screenHeight }}>

                    <Text style={[GlobalStyles.text14, { alignSelf: 'flex-start' }]}>
                        How much do you want to settle for?
                    </Text>

                    <View style={[GlobalStyles.input, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                        <Text style={GlobalStyles.text14}>
                            $
                        </Text>
                        <TextInput
                            placeholder='0.00'
                            keyboardType='numeric'
                            value={amount}
                            onChangeText={(text) => {
                                let formatedAmount = formatAmount(text)
                                setAmount(formatedAmount)
                            }}
                            autoFocus={true}
                            placeholderTextColor={'black'}
                            style={{ width: 330 / 430 * screenWidth }}
                        />
                    </View>

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                            navigation.push(ScreenNames.ConfirmYapSattelmentOfferScreen, {
                                review: review
                            })
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

export default YapSattelmentAmount