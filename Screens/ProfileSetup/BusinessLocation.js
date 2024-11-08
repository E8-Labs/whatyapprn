import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import AddressPicker from '../../components/AddressPicker'
import { ShowMessage } from '../../components/ShowMessage'


const BusinessLocation = ({ navigation, route }) => {


    const [showAddressPicker, setShowAddressPicker] = useState(false)
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [address, setAddress] = useState("")
    const[error,setError] = useState('')

    const user = route.params.user
    user.business_address = address
    user.from = 'location'

    const handleContinuePress = () => {
        if (!address) {
            setError("Please select your business location")
            return
        }
        navigation.push(ScreenNames.BusinessDetailsScreen, {
            user: user,
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
                        <Image source={require('../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        4 of 5
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight, gap: 10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Business Location
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Select your business location
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setShowAddressPicker(true)
                        }}
                    >
                        <View style={[GlobalStyles.input, {
                            flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
                        }]}>

                            <Text style={GlobalStyles.text14}>
                                {address?address:'Address'}

                            </Text>

                            <Image source={require('../../assets/Images/locationIcon.png')}
                                style={GlobalStyles.image24}
                            />
                        </View>
                    </TouchableOpacity>

                    {
                        error && <Text style = {GlobalStyles.errorText}>{error}</Text>
                    }


                    <Modal
                        transparent={true}
                        visible={showAddressPicker}
                        animationType='slide'
                    >
                        <AddressPicker closeModal={() => {
                            setShowAddressPicker(false)

                        }}
                            PickAddress={(address) => {
                                console.log('picked address is', address)
                                let completeAddress = ""
                                if (address.streetNo) {
                                    completeAddress = address.streetNo
                                }
                                if (address.route) {
                                    completeAddress = completeAddress + ` ${address.route}`
                                }
                                if (address.city) {
                                    completeAddress = completeAddress + ` ${address.city}`
                                }
                                if (address.longState) {
                                    completeAddress = completeAddress + ` ${address.longState}`
                                }
                                if (address.state) {
                                    completeAddress = completeAddress + ` ${address.state}`
                                }
                                console.log("Compelte address is ", completeAddress)
                                setState(address.shortState)
                                setCity(address.city)
                                setAddress(completeAddress)
                                setError("")
                            }}

                        />
                    </Modal>

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

export default BusinessLocation