import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { ShowMessage } from '../../components/ShowMessage'

const YapTransactionDate = ({ navigation, route }) => {

    const [showCalender, setShowcalender] = useState(false)
    const [selectedDate, setSelectedDate] = useState("Date")
    const [error,setError] = useState("")

    const yap = route.params.yap
    yap.dateOfTransaction = selectedDate


    const handleContinuePress = () => {
        if (selectedDate === "Date") {
            setError("Date of transaction reqiuired")
            return
        }
        navigation.push(ScreenNames.YapMediaUploadScreen,{
            yap:yap
        })

    }

    const date = new Date()
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
                        Date of transaction
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            setShowcalender(true)
                        }}
                    >
                        <View style={[GlobalStyles.input, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>

                            <Text
                                style={{ width: 325 / 430 * screenWidth }}
                            >
                                {selectedDate}
                            </Text>
                            <Image source={require('../../assets/Images/calenderIcon.png')}
                                style={GlobalStyles.image24}
                            />
                        </View>
                    </TouchableOpacity>

                    <DatePicker
                        modal
                        open={showCalender}
                        maximumDate={date}
                        date={date}
                        mode='date'
                        onConfirm={(date) => {
                            setShowcalender(false)
                            setError("")
                            console.log('date is', date)
                            let d = moment(date).format("MM/DD/YYYY")
                            setSelectedDate(d)
                        }}
                        onCancel={() => {
                            setShowcalender(false)
                        }}
                    />

                    {
                        error&&<Text style = {GlobalStyles.errorText}>{error}</Text>
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

export default YapTransactionDate