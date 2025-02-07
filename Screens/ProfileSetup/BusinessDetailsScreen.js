import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import { updateProfile } from '../../components/UpdateProfile'
import { ShowMessage } from '../../components/ShowMessage'
import LoadingAnimation from '../../components/LoadingAnimation'

const BusinessDetailsScreen = ({ navigation, route }) => {


    const [details, setDetails] = useState("")
    const [loading, setLoading] = useState(false)
    const[error,setError] = useState('')


    const user = route.params.user
    user.about_business = details
    console.log('user on about screen is', user)

    const handleContinuePress = async () => {
        if (!details) {
            // ShowMessage("Please describe your business in detail")
            setError("Business description required")
            return
        }

        if (user.from === 'profile') {
            let data = {
                about_business: details,
            }
            setLoading(true)
            await updateProfile(data)
            setLoading(false)
            navigation.goBack()
            return
        }
        setLoading(true)
        let apidata = {
            business_industry: user.business_industry,
            business_address: user.business_address,
            about_business: details,
            business_employees: user.business_employees,

        }

        let data = await updateProfile(apidata)
        console.log('data is', data)
        setLoading(false)
        if (data) {
            navigation.push(ScreenNames.NotificationPermitionScreeen, {
                user: user,
                from:"BusinessFlow"
            })
        } else {
            console.log('no data')
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
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        5 of 5
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight, gap: 10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Tell Us About Your Business
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Describe your business in detail
                    </Text>

                    <TextInput
                        multiline
                        maxLength={250}
                        onChangeText={(text) => {
                            setDetails(text)
                            setError("")
                        }}
                        style={[GlobalStyles.input, { height: 160 / 930 * screenHeight }]}
                        placeholder='Enter description here'
                    />
                    {
                        error&&<Text style = {GlobalStyles.errorText}>{error}</Text>
                    }

                    <Text style={{fontSize:14,fontFamily:CustomFonts.InterMedium,alignSelf:'flex-end'}}>
                        {details.length}/250
                    </Text>

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
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

export default BusinessDetailsScreen