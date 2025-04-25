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

// import * as AppleAuthentication from 'expo-apple-authentication';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';

GoogleSignin.configure({
    iosClientId: '311004442185-ev6am2pcrj1ahqvhij8sgc9mdm7u7djt.apps.googleusercontent.com',
});

const eye = require('../../assets/Images/eye.png')
const eyeSlash = require('../../assets/Images/eye-slash.png')

const LoginScreen = ({ navigation }) => {


    const [showPass, setShowPass] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const GoogleLogin = async () => {
        console.log("trying to login google")
        try {
            // await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("user info from google", userInfo)


            console.log("Google name is ", userInfo.data.user)
            socialLogin({ name: userInfo.data.user.name, email: userInfo.data.user.email, provider_name: "google", provider_id: userInfo.data.user.id, profile_image: userInfo.data.user.photo, })

            console.log("Trying to signin with google ")



            // setState({ userInfo });
        } catch (error) {
            console.log("Error ", error)

        }
    };

    // const appleLogin = async () => {
    //     try {

    //         let credential = await AppleAuthentication.signInAsync({
    //             requestedScopes: [
    //                 AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    //                 AppleAuthentication.AppleAuthenticationScope.EMAIL,
    //             ],
    //         });
    //         // signed in
    //         // let cr = {"authorizationCode": "c352b03fb0d6e4defa3f626d9d9d45fa5.0.styx.lBXUeXBx15Ohk42_CU_rKQ", "email": "spidyzno3@gmail.com", "fullName": {"familyName": "Bin khalid", "givenName": "Waleed", "middleName": null, "namePrefix": null, "nameSuffix": null, "nickname": null}, "identityToken": "eyJraWQiOiJsVkhkT3g4bHRSIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLmU4bGFicy5wbHVyYXdsIiwiZXhwIjoxNzEwNjI5MDE0LCJpYXQiOjE3MTA1NDI2MTQsInN1YiI6IjAwMDM4Ny5lMDYyYzMxZTBlMjg0YmQwOTcxYzE1NzI5ZmNmOGU2ZS4yMjQzIiwiY19oYXNoIjoiZjBpdy1mdGpjOXBfblVPNlBqRVdxZyIsImVtYWlsIjoic3BpZHl6bm8zQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdXRoX3RpbWUiOjE3MTA1NDI2MTQsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZSwicmVhbF91c2VyX3N0YXR1cyI6Mn0.Z41O2oWCfpIxQtnTdwgNuHdwHx1W0iS-P7qf-L4HusgEswzhGZ8G1Ss1FMNnh0FXXwkX174uj_kykhGROqMelNnbQ_HkvCU1yYhlAQ29rQNu7GyAzLUs070wU1RdrHO7napvUtHh4JncAnUyXm6zxLGaciDKVOQ8RX4GOVPogcczjKSQse6Y9CggMLHpvjrZ-pSFyyw4oLssm1GXteEhGCckhl3V_h4QIhLstr03ZUVErVoyy2gtq0pV55Xf6jc28p666Ph2K2Cgh_AeSh_cq8I4iv3CgaD_A25dOmtJrweRYDgKYJYGYAmNVhC9xVFIxedQG8L34GC-4C29p1n_qQ", "realUserStatus": 2, "state": null, "user": "000387.e062c31e0e284bd0971c15729fcf8e6e.2243"}

    //         if (credential.email !== null) {
    //             //save credentials here
    //             AsyncStorage.setItem("applelogin", JSON.stringify(credential))
    //         }
    //         else {
    //             //get credentials here
    //             let cr = await AsyncStorage.getItem("applelogin")
    //             if (cr) {
    //                 credential = JSON.parse(cr)
    //             }
    //         }
    //         //Call the api here
    //         socialLogin({ first_name: credential.fullName.givenName, last_name: credential.fullName.familyName, email: credential.email, provider_name: "apple", provider_id: credential.user })

    //         console.log("Apple credentials ", credential)
    //     } catch (e) {
    //         console.log("Exception ", e)
    //         if (e.code === 'ERR_REQUEST_CANCELED') {
    //             // handle that the user canceled the sign-in flow
    //         } else {
    //             // handle other errors
    //         }
    //     }
    // }

    const handleFacebookLogin = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(["public_profile"]);

            if (result.isCancelled) {
                console.log("Login cancelled");
                Alert.alert('Login cancelled');
            } else {
                console.log("Login success with permissions:", result);

                const data = await AccessToken.getCurrentAccessToken();

                if (!data) {
                    console.log("Something went wrong obtaining access token");
                    Alert.alert('Error', 'Something went wrong obtaining access token');
                } else {
                    console.log("Access token obtained:", data.accessToken.toString());

                    const currentProfile = await Profile.getCurrentProfile();

                    if (currentProfile) {
                        console.log("Current Profile:", currentProfile);
                        // Alert.alert('Login Success', `Logged in as ${currentProfile.name}`);
                        socialLogin({ first_name: currentProfile.firstName, last_name: currentProfile.lastName, email: currentProfile.userID + "@gmail.com", provider_name: "facebook", provider_id: currentProfile.userID, profile_image: currentProfile.imageURL, })

                        // Perform further actions with the profile data, e.g., signInSocial function
                    } else {
                        console.log("No current profile found");
                        Alert.alert('Error', 'No current profile found');
                    }
                }
            }
        } catch (error) {
            console.log("Login failed with error:", error);
            Alert.alert('Login failed', error.message);
        }
    };


    const socialLogin = async (data) => {
        console.log('data is', data)
        // return

        try {
            const result = await fetch(Apipath.socialLogin, {
                method: 'post',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (data.provider_name === 'apple') {
                // setIndicator3(true)
            } else if (data.provider_name === 'google') {
                // setIndicator1(true)
            } else if (data.provider_name === 'facebook') {
                // setIndicator2(true)
            }
            if (result) {
                let json = await result.json();
                console.log(json)
                if (json.status == true) {
                    AsyncStorage.setItem("USER", JSON.stringify(json.data))

                    console.log("Stored user data in local is ", json.data)

                    if (json.message === 'Logged in') {
                        let data = json.data.user
                        let from = "Login"
                        if (data.media.length > 0) {
                            navigation.push(ScreenNames.TabbarContainer, {
                                from: 'login'
                            })
                        } else {
                            navigation.push(ScreenNames.UploadMediaScreen, {
                                from: 'login'
                            })
                        }



                    } else if (json.message === 'User registered') {
                        navigation.navigate(ScreenNames.BusinessWebScreen, {
                            user: '',
                            from: 'Login'
                        })
                    }
                    // setIndicator1(false)
                    // setIndicator2(false)
                    // setIndicator3(false)
                }
                else {

                    setError(json.message)
                }

            }
        } catch (error) {
            setError(error.message)
            console.log('error finding', error)
        }
    }

    const loginUser = async () => {

        Keyboard.dismiss()

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmail = emailRegex.test(email)

        if (!email || !password) {
            setError("Enter email and password")
            return
        } else if (!validEmail) {
            setError(" Invalid email")
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
                        } else {
                            navigation.push(ScreenNames.TabbarContainer, {
                                from: 'login'
                            })
                        }
                    } else {
                        console.log('login api message is', result.data.message)
                        setError(result.data.message)
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
                            Welcome back
                        </Text>

                        <View style={[GlobalStyles.input, {
                            flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight
                        }]}>
                            <TextInput
                                placeholder='Email address'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                placeholderTextColor={Colors.lightBlack}
                                style={{
                                    width: 320 / 430 * screenWidth,
                                    fontFamily: CustomFonts.InterMedium
                                }}
                                onChangeText={(text) => {
                                    setEmail(text)
                                    setError("")
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
                                placeholderTextColor={Colors.lightBlack}
                                onChangeText={(text) => {
                                    setPassword(text)
                                    setError("")
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

                        {error && <Text style={[GlobalStyles.errorText, { marginTop: 10 }]}>{error}</Text>}

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
                        <TouchableOpacity
                            onPress={GoogleLogin}
                        >
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

                        <TouchableOpacity
                            // onPress={appleLogin}
                        >
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


                        <TouchableOpacity
                            onPress={()=>{
                                handleFacebookLogin()
                            }}
                        >
                            
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

                        <TouchableOpacity style={{ marginTop: 40 / 430 * screenHeight }}
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