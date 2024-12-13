import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'
import formatAmount from '../../res/FormateAmount'


const YapTransactionAmountScreen = ({ navigation, route }) => {

    const [amount, setAmount] = useState("")
    const [formatedamount, setFormatedAmount] = useState("")
    const [error, setError] = useState("")

    const yap = route.params.yap
    yap.transactionAmount = amount

    useEffect(()=>{
        console.log('amount', amount)
    },[amount])


    const handleContinuePress = () => {
        if (!amount) {
            setError("Transaction amount required")
            return
        }
        navigation.push(ScreenNames.YapTransactionDate, {
            yap: yap
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
                        Create Yap!
                    </Text>
                    <View></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        Transaction amount
                    </Text>

                    <View style={[GlobalStyles.input, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                        <Text style={GlobalStyles.text14}>
                            $
                        </Text>
                        <TextInput
                            autoFocus={true}
                            value={formatedamount}
                            onChangeText={(text) => {
                                let formated = formatAmount(text)
                                setFormatedAmount(formated)
                                setAmount(text)
                            }}
                            placeholder='0.00'
                            placeholderTextColor={'black'}
                            keyboardType='numeric'
                            style={{ width: 330 / 430 * screenWidth }}
                        />

                    </View>
                    {
                        error && (
                            <Text style={GlobalStyles.errorText}>{error}</Text>
                        )
                    }
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

export default YapTransactionAmountScreen