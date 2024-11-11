import { View, Text, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { CustomFonts } from '../../assets/font/Fonts'
import { screenHeight, screenWidth } from '../../res/Constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'
const DisputeScreen = ({ navigation, route }) => {

    const [resone, setResone] = useState("")
    const [loading, setLoading] = useState(false)

    const review = route.params.review
    const updateView = route.params.updatedView
    // console.log('updateView function is', updateView)
    // console.log('review is ', review)

    const disputeReview = async () => {

        // navigation.pop()
        // return
        try {
            setLoading(true)
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)

                let apidata = {
                    reviewId: review.id,
                    resone: resone
                }
                let path = Apipath.disputeReview
                console.log('path is', path)
                console.log('body data is', apidata)
                // return

                // return
                const response = await axios.post(path, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.data) {
                    setLoading(false)
                    if (response.data.status === true) {
                        console.log('review dispute data is', response.data.data)
                        if (updateView) {
                            updateView(response.data.data)
                        } else {
                            console.log('unable to fecth function')
                        }
                        navigation.pop()
                    } else {
                        console.log('dispute message is', response.data.message)
                    }
                }


            }
        } catch (e) {
            setLoading(false)
            console.log('error in dispute review', e)
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
                        Disagree
                    </Text>
                    <View></View>
                </View>

                <Text style={[GlobalStyles.heading24, { marginTop: 30 / 930 * screenHeight }]}>
                    Reason for dispute
                </Text>

                <Text style={[GlobalStyles.text17, { alignSelf: 'center', width: screenWidth - 50, marginTop: 20 / 930 * screenHeight }]}>
                    Tell us your side of the story
                </Text>

                <TextInput style={[GlobalStyles.input, { height: 164 / 930 * screenHeight, marginTop: 50 / 930 * screenHeight, }]}
                    multiline
                    placeholder='Type Here'
                    onChangeText={(text) => {
                        setResone(text)
                    }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 / 430 * screenWidth, marginTop: 30 / 930 * screenHeight }}>
                    <Image source={require('../../assets/Images/alertIcon.png')}
                        style={GlobalStyles.image24}
                    />
                    <Text style={[GlobalStyles.text14, { width: 337 / 430 * screenWidth }]}>
                        You'll only be able to submit this disagreement one time.
                    </Text>
                </View>

                <TouchableOpacity style={GlobalStyles.capsuleBtn}
                    onPress={() => {
                        disputeReview()
                    }}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Submit
                    </Text>
                </TouchableOpacity>


            </View>
        </SafeAreaView>
    )
}

export default DisputeScreen