import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'



const YapExperienceScreen = ({ navigation, route }) => {

    const yap = route.params.yap
    console.log('yap on experience screen is', yap)

    const [experience, setExperience] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleContinuePress = async () => {
        Keyboard.dismiss()
        if (!experience) {
            setError("Experience required")
            return
        }
        console.log('yap.media', yap.media)

        let mediaUrls = []
        yap.media.forEach((item) =>
            mediaUrls.push(item.url)
        )
        console.log('media urls are ', mediaUrls)
        // return
        setLoading(true)
        try {
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)
                let apidata = new FormData()
                let transactionAmount;
                let settlementAmount;
                if (yap.settlementAmount) {
                    console.log('yap.settlementAmount', yap.settlementAmount)
                    transactionAmount = Number(yap.settlementAmount && yap.transactionAmount.replace(",", ""))
                }
                if (yap.transactionAmount) {
                    console.log('yap.transactionAmount',yap.transactionAmount)

                    settlementAmount = Number(yap.transactionAmount && yap.transactionAmount.replace(",", ""))
                }

                apidata.append("service", yap.service)
                apidata.append("amountOfTransaction", yap.transactionAmount)
                apidata.append("dateOfTransaction", yap.dateOfTransaction)
                apidata.append("yapScore", yap.yapScore)
                {
                    yap.settlementOffer && (
                        apidata.append("settlementOffer", yap.settlementOffer)
                    )
                }
                {
                    yap.settlementAmount && (
                        apidata.append("settlementAmount", yap.settlementAmount)
                    )
                }
                apidata.append("notesAboutCustomer", experience)
                apidata.append("customerId", yap.user.id)
                mediaUrls.forEach((url, index) => {
                    apidata.append("media", {
                        name: 'media',
                        uri: url
                    });
                });

                console.log('apidata is', apidata)
                // return

                const response = await axios.post(Apipath.addYap, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                    }
                })
                // console.log('response', response)

                if (response.data) {
                    setLoading(false)
                    if (response.data.status === true) {
                        console.log('yad add data', response.data.data)
                        ShowMessage("Congrats! yap added successfully", Colors.orangeColor)
                        if (yap.settlementAmount) {
                            navigation.push(ScreenNames.TabbarContainer, {
                                from: 'addReview'
                            })
                        } else {
                            navigation.push(ScreenNames.TabbarContainer, {
                                from: 'addReview'
                            })
                        }
                    } else {
                        console.log('add response message is', response.data.message)
                        setError(response.data.message)
                    }
                }
            }
        } catch (e) {
            setLoading(false)
            console.log('error in add yap is', e)
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && (
                    <LoadingAnimation visible={loading} />
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
                        Create Yap!
                    </Text>
                    <View></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        What was your experience dealing with this customer?
                    </Text>
                    <Text style={[GlobalStyles.text14, { alignSelf: 'flex-start' }]}>  This will be posted for the public to see
                    </Text>

                    <TextInput
                        multiline
                        maxLength={250}
                        onChangeText={(text) => {
                            setExperience(text)
                            setError("")
                        }}
                        placeholder='Type here'
                        placeholderTextColor={'black'}
                        style={[GlobalStyles.input, { height: 140 / 930 * screenHeight }]}
                    />
                    <Text style={[GlobalStyles.text17, { alignSelf: 'flex-end' }]}>{experience.length}/250</Text>

                    {
                        error && <Text style={GlobalStyles.errorText}>{error}</Text>
                    }

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                            handleContinuePress()
                        }}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Save & Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>

    )
}

export default YapExperienceScreen