import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ShowMessage } from '../../components/ShowMessage'

const eye = require('../../assets/Images/eye.png')
const eyeSlash = require('../../assets/Images/eye-slash.png')

const LicenseDetailsScreen = ({ navigation, route }) => {

    const [weburl, setWeburl] = useState('')
    const [name, setName] = useState('')
    const [lNumber, setLNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState("")
    const [error, setError] = useState("")
    const [isAvailable, setIsAvailable] = useState(false)

    const from = route.params.user.from
    // console.log('from', from)
    useEffect(() => {
        let u = route.params.user.user
        setUser(u)
        console.log('user details on license details screen', u)
        setName(u.licenseDetails ? u.licenseDetails.name : '')
        setLNumber(u.licenseDetails ? u.licenseDetails.driverLicense : '')
    }, [])

    user.business_website = weburl

    const handleContinuePress = async () => {

        if(!isAvailable){
            
            return
        }

        if (!name || name === "Name not found") {
            setError("Fill in the name")
            return
        }
        if (!lNumber) {
            setError("Fill in the license number")
            return
        }
        // return
        if (from === "AddCustomer") {
            console.log('user is', user)
            // return
            navigation.push(ScreenNames.CustomerEmailScreen, {
                user: {
                    name: name,
                    licenseNumber: lNumber,
                    licenseImage: user.licenseImage
                }
            })
            return
        }
        try {
            setLoading(true)
            let formdata = new FormData()


            formdata.append("email", user.email)
            formdata.append('password', user.password)
            formdata.append('role', "customer")
            formdata.append('username', name)
            formdata.append('phone', "")
            formdata.append('name', name)
            formdata.append('driver_license_id', lNumber)

            formdata.append('driver_license', {
                name: 'image',
                type: 'JPEG',
                uri: user.licenseImage
            })

            console.log('form data is', formdata)
            // return

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
                        from: 'LicenseDetailsScreen'
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

     useEffect(() => {
            let timer = setTimeout(() => {
                if (lNumber) {
                    console.log('timer finished')
                    checkLicenseExists(lNumber)
                }
            }, 500);
            return () => clearTimeout(timer)
        }, [lNumber])

    const checkLicenseExists = async (number) => {

        
        const apiData = {
            driverLicenseId: number
        }
        try {
            const response = await axios.post(Apipath.checkLicenseExists, apiData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response) {
                console.log('response of check license api is', response.data)
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
            setError("Cannot check if license exists.")
            console.log('error in  check email api', e)
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

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Verify Identity
                    </Text>
                    <View></View>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column', gap: 30 / 930 * screenHeight,
                    marginTop: 50 / 930 * screenHeight
                }}>
                    <Text style={GlobalStyles.heading24}>
                        License Details
                    </Text>
                    {/* <Text style={GlobalStyles.subheading14}>
                    Make sure license details are correctly sccaned
                </Text> */}
                    <View style={[GlobalStyles.input, {
                        flexDirection: 'row', alignContent: 'center', gap: 8 / 430 * screenWidth
                    }]}>
                        <Text style={[GlobalStyles.text14, { color: '#00000090' }]}>
                            Name:
                        </Text>
                        <TextInput
                            placeholder='Name'
                            autoCapitalize='none'
                            value={name}
                            //  secureTextEntry={!showPass}
                            onChangeText={(text) => {
                                setError("")
                                setName(text)
                            }}
                            style={{ width: 310 / 430 * screenWidth }}
                        />
                    </View>

                    <View style={[GlobalStyles.input, {
                        flexDirection: 'row', alignContent: 'center', gap: 8 / 430 * screenWidth
                    }]}>
                        <Text style={[GlobalStyles.text14, { color: '#00000090' }]}>
                            License Number:
                        </Text>
                        <TextInput
                            placeholder='License number'
                            autoCapitalize='none'
                            value={lNumber}
                            //  secureTextEntry={!showPass}
                            onChangeText={(text) => {
                                setLNumber(text)
                                setError("")
                            }}
                            style={{ width: 290 / 430 * screenWidth }}
                        />

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

export default LicenseDetailsScreen