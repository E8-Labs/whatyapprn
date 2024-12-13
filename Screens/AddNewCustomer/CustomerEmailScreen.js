import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
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


const CustomerEmailScreen = ({ navigation, route }) => {

    const user = route.params.user
    console.log('user on customer email screen is', user)

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [isAvailable, setIsAvailable] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let timer = setTimeout(() => {
            if (email) {
                console.log('timer finished')
                checkEmailExists(email)
            }
        }, 500);
        return () => clearTimeout(timer)
    }, [email])

    const checkEmailExists = async (e) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const validEmail = emailRegex.test(e)
        if (!validEmail) {
            setError("Invalid email")
            return
        }
        const apiData = {
            email: e
        }
        try {
            const response = await axios.post(Apipath.checkEmailExists, apiData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response) {
                console.log('response of check email api is', response.data)
                if (response.data.status === true) {
                    setIsAvailable(true)
                    setError("")
                } else {
                    setIsAvailable(false)
                    setError(response.data.message)
                }
            }
        } catch (e) {
            setLoading(false)
            setError("Cannot check if email exists.")
            console.log('error in  check email api', e)
        }
    }


    const handleContinuePress = async () => {
        Keyboard.dismiss()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const validEmail = emailRegex.test(email)

        if (!email || error) {
            setError("Enter valid email")
            return
        }

        if (!validEmail) {
            setIsAvailable(false)
            setError("Enter valid email")
            return
        }
        setLoading(true)
        try {
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)

                const formData = new FormData()

                formData.append("email", email)
                formData.append("name", user.name)
                formData.append("username", user.name)
                formData.append("driver_license_id", user.licenseNumber)
                formData.append("driver_license", {
                        name: 'image',
                        uri: user.licenseImage
                    })

                console.log('formData', formData)
// return
                const response = await axios.post(Apipath.addNewCustomer, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token
                    }
                })
                setLoading(false)
                if (response.data) {
                    if (response.data.status === true) {
                        console.log('add new customer api response is ', response.data.data)
                        ShowMessage("Congrats! Customer added successfully",Colors.orangeColor)
                        navigation.pop(3)
                    } else {
                        console.log('add new customer message is', response.data.message)
                        ShowMessage(response.data.message)
                    }
                }
            }
        } catch (e) {
            setLoading(false)
            console.log('error in add new customer api', e)
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && <LoadingAnimation visible={loading} />
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
                        New Customer
                    </Text>
                    <View></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        Email address
                    </Text>

                    <TextInput
                        placeholder='Enter email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        placeholderTextColor={'black'}
                        onChangeText={(text) => {
                            setEmail(text)
                            setError("")
                        }}
                        style={GlobalStyles.input}
                    />

                    {
                        error && <Text style={[GlobalStyles.errorText, { marginTop: 15, alignSelf: 'flex-start' }]}>{error}</Text>
                    }

                    {
                        isAvailable && <Text style={[GlobalStyles.erText, { color: 'green', marginTop: 15, alignSelf: 'flex-start' }]}>
                            Email available
                        </Text>
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

export default CustomerEmailScreen