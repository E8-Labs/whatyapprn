import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { Colors } from '../../../res/Colors'
import { ScreenNames } from '../../../res/ScreenNames'
import { ShowMessage } from '../../../components/ShowMessage'
import { updateProfile } from '../../../components/UpdateProfile'

const eye = require('../../../assets/Images/eye.png')
const eyeSlash = require('../../../assets/Images/eye-slash.png')

const BusinessWebScreen = ({ navigation, route }) => {

    const [weburl, setWeburl] = useState('')
    const [error, setError] = useState("")
    const [isValidUrl, setIsValidUrl] = useState(false)
    const [loading,setLoading] = useState(false)

    const user = route.params.user
    user.business_website = weburl

    let from = route.params.from

    useEffect(() => {
        console.log('use effect called')
        const timer = setTimeout(() => {
            console.log('timer clear')
            if (weburl) {
                checkIsValidUrl(weburl)
            }
        }, 500);


        return ()=>clearTimeout(timer)
    }, [weburl])

    const checkIsValidUrl = (url) => {
        console.log('trying to check url')
        let urlRegex = new RegExp(/((https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)?)/);
        let validUrl = urlRegex.test(url)

        if (validUrl) {
            setError("")
            setIsValidUrl(true)
        } else {
            setError("Invalid url")
            setIsValidUrl(false)
        }

    }

    const handleContinuePress =async () => {
        
        if (error) {
            setError(error)
            return
        }
        if(from === "Login"){
            let apidata = {
                business_website:weburl
            }
            setLoading(true)
            let data = await updateProfile(apidata)
            if(data){
                setLoading(false)
                navigation.push(ScreenNames.AuthCongratsScreen)
            }
        }
        navigation.push(ScreenNames.PasswordScreen, {
            user: user
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
                        <Image source={require('../../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        2 of 3
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column', gap: 30 / 930 * screenHeight,
                    marginTop: 50 / 930 * screenHeight
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Business Website
                    </Text>

                    <TextInput
                        placeholder='Website'
                        autoCapitalize='none'
                        autoFocus = {true}
                        //  secureTextEntry={!showPass}
                        onChangeText={(text) => {
                            setWeburl(text)
                            setError("")
                            setIsValidUrl(false)
                        }}
                        style={GlobalStyles.input}
                    />

                    {
                        error && <Text style={GlobalStyles.errorText}>{error}</Text>
                    }
                    {
                        isValidUrl && <Text style={[GlobalStyles.errorText, { color: 'green', }]}>Valid Url</Text>
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

export default BusinessWebScreen