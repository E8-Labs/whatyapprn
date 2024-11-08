import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { Colors } from '../../../res/Colors'
import { ScreenNames } from '../../../res/ScreenNames'
import axios from 'axios'
import { Apipath } from '../../../Api/Apipaths'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ShowMessage } from '../../../components/ShowMessage'
import LoadingAnimation from '../../../components/LoadingAnimation'

const eye = require('../../../assets/Images/eye.png')
const eyeSlash = require('../../../assets/Images/eye-slash.png')

const PasswordScreen = ({ navigation, route }) => {


    // console.log('user on password screen is', user)

    const [showPass, setShowPass] = useState(false)
    const [password, setPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const user = route.params.user
    user.password = password


    const handleContinuePress = async () => {
        if (!password) {
            setError("Password required")
            return
        }
        if (user.role === 'customer') {
            navigation.push(ScreenNames.LicenseScreen, {
                user: user
            })
            return
        }
        try {
            setLoading(true)
            let formdata = new FormData()


            formdata.append("email", user.email)
            formdata.append('password', password)
            formdata.append('role', "business")
            formdata.append('username', user.username)
            formdata.append('phone', "")
            formdata.append('name', user.username)
            formdata.append("business_website", user.business_website)
            user.media && (
                formdata.append('media', {
                    name: 'image',
                    type: 'JPEG',
                    uri: user.media
                })
            )

            console.log('form data is', formdata)

            const response = await axios.post(Apipath.registerUser, formdata, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            setLoading(false)
            if (response) {
                console.log('user register api response is', response.data)
                if (response.data.status === true) {
                    AsyncStorage.setItem("USER", JSON.stringify(response.data.data))

                    navigation.push(ScreenNames.AuthCongratsScreen, {
                        from: 'PasswordScreen'
                    })

                } else {
                    console.log('register api message is', response.data.message)
                    setError(response.data.message)
                }
            }

        } catch (e) {
            setLoading(false)
            console.log('eror in register user api is', e)
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
                        <Image source={require('../../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        {user.role !== 'customer'?"3 of 3":''}
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column', gap: 30 / 930 * screenHeight,
                    marginTop: 50 / 930 * screenHeight
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Password
                    </Text>
                    <View style={[GlobalStyles.input, {
                        flexDirection: 'row', justifyContent: 'space-between',
                    }]}>
                        <TextInput
                            placeholder='Password'
                            secureTextEntry={!showPass}
                            onChangeText={(text) => {
                                setPassword(text)
                            }}
                            style={{ width: 320 / 430 * screenWidth }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setShowPass(!showPass)
                            }}
                        >
                            <Image source={showPass ? eye : eyeSlash}
                                style={GlobalStyles.image24}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        error && <Text style={GlobalStyles.errorText}>{error}</Text>
                    }

                    <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 10 / 930 * screenHeight }]}
                        onPress={handleContinuePress}
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

export default PasswordScreen