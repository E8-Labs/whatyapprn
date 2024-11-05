import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import { ShowMessage } from '../../components/ShowMessage'
import LoadingAnimation from '../../components/LoadingAnimation'
import AsyncStorage from '@react-native-async-storage/async-storage'

const eye = require('../../assets/Images/eye.png')
const eyeSlash = require('../../assets/Images/eye-slash.png')

const LoginScreen = ({ navigation }) => {

    const [showPass, setShowPass] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const loginUser = async () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmail = emailRegex.test(email)

        if (!email || !password) {
            ShowMessage("Enter email or password", "red",)
            return
        } else if (!validEmail) {
            ShowMessage("Enter valid email")
            return
        } else {
            try {
                setLoading(true)
                console.log('apipath is', Apipath.loginUser)
                let api = Apipath.loginUser;
                const ApiData = {
                    email: email,
                    password: password
                }

                const result = await axios.post(api, ApiData, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (result) {
                    setLoading(false)
                    console.log('result is', result.data.data)
                    if (result.data.status === true) {

                        console.log('user data is', result.data)
                        AsyncStorage.setItem("USER", JSON.stringify(result.data.data))
                        if (result.data.data.user.role === "admin") {
                            navigation.push(ScreenNames.AdminTabbarContainer)
                        }else{
                            navigation.push(ScreenNames.TabbarContainer)
                        }
                    } else {
                        console.log('login api message is', result.data.message)
                        ShowMessage(result.data.message)
                    }
                }
            } catch (e) {
                setLoading(false)
                // ShowMessage(e)
                console.log('error in login api', e)
            }
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && (
                    <LoadingAnimation visible={loading} />
                )
            }
            <TouchableWithoutFeedback
                // style = {GlobalStyles.container} 
                onPress={Keyboard.dismiss}
            >
                <View style={GlobalStyles.container}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 30, }}>
                        <Image source={require('../../assets/Images/logo.png')}
                            style={[GlobalStyles.logoImage, {
                                marginLeft: 10 / 430 * screenWidth, marginTop: 15 / 930 * screenHeight
                            }]} />
                        <Text style={GlobalStyles.heading}>
                            Welcome back bud
                        </Text>

                        <View style={[GlobalStyles.input, {
                            flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight
                        }]}>
                            <TextInput
                                placeholder='Email address'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                style={{
                                    width: 320 / 430 * screenWidth,
                                    fontFamily: CustomFonts.InterMedium
                                }}
                                onChangeText={(text) => {
                                    setEmail(text)
                                }}
                            />
                            <Image source={require('../../assets/Images/emailIcon.png')}
                                style={{
                                    height: 28,
                                    width: 28,
                                }}
                            />
                        </View>


                        <View style={[GlobalStyles.input, {
                            flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight
                        }]}>
                            <TextInput
                                placeholder='Password'
                                secureTextEntry={!showPass}
                                style={{
                                    width: 320 / 430 * screenWidth,
                                    fontFamily: CustomFonts.InterMedium
                                }}
                                onChangeText={(text) => {
                                    setPassword(text)
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setShowPass(!showPass)
                                }}
                            >
                                <Image source={showPass ? eye : eyeSlash}
                                    style={{
                                        height: 28,
                                        width: 28,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{ marginTop: 30 / 930 * screenHeight, alignSelf: 'flex-start', marginLeft: 10 / 430 * screenWidth }}>
                            <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                Forgot Password
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[GlobalStyles.capsuleBtn,]}
                            onPress={loginUser}
                        >
                            <Text style={[GlobalStyles.BtnText]}>
                                Continue to account
                            </Text>
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
                            marginTop: 30 / 930 * screenHeight
                        }}>
                            Or
                        </Text>
                        <TouchableOpacity>
                            <View style={styles.socialContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image source={require('../../assets/Images/googleIcon.png')}
                                        style={GlobalStyles.image24}
                                    />
                                    <Text style={styles.socialText}>
                                        Sign in with Google
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <View style={styles.socialContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image source={require('../../assets/Images/appleIcon.png')}
                                        style={GlobalStyles.image24}
                                    />
                                    <Text style={styles.socialText}>
                                        Sign in with Apple
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity>
                            <View style={styles.socialContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <Image source={require('../../assets/Images/facebookIcon.png')}
                                        style={GlobalStyles.image24}
                                    />
                                    <Text style={styles.socialText}>
                                        Sign in with Facebook
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 50 / 430 * screenHeight }}
                            onPress={() => {
                                navigation.push(ScreenNames.RoleSelectionScreen)
                            }}
                        >
                            <Text style={[GlobalStyles.BtnText, { color: 'black' }]}>
                                No Account? Sign Up
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default LoginScreen


const styles = StyleSheet.create({
    socialContainer: {
        width: screenWidth - 30,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20 / 930 * screenHeight,
        marginTop: 30 / 930 * screenHeight
    },
    socialText: {
        fontSize: 18 / 930 * screenHeight,
        fontFamily: CustomFonts.InterMedium
    },
    socialIcon: {
        height: 25 / 930 * screenHeight,
        width: 25 / 430 * screenWidth,
        resizeMode: 'contain'

    }
})