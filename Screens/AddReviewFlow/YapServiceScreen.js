import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'


const YapServiceScreeen = ({ navigation,route }) => {

    const [service,setService] = useState("")
    const [error,setError] = useState("")

    const user = route.params.user

    const handleContinuePress = () =>{
        if(!service){
            setError("Service name required")
            return
        }
        navigation.push(ScreenNames.YapTransactionAmountScreen,{
            yap:{
                user:user,
                service:service
            }
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

                    <Text style={GlobalStyles.text14}>
                        Create Yap!
                    </Text>
                    <View style = {{width:50}}></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        What service or product did you provide?
                    </Text>

                    <TextInput
                        multiline
                        onChangeText={(text)=>{
                            setService(text)
                            setError("")
                        }}
                        maxLength={250}
                        placeholder='Type here'
                        placeholderTextColor={'black'}
                        style={[GlobalStyles.input,{height:140/930*screenHeight}]}
                    />
                    <Text style = {[GlobalStyles.text17,{alignSelf:'flex-end'}]}>{service.length}/250</Text>

                    {
                        error && (
                            <Text style = {GlobalStyles.errorText}>{error}</Text>
                        )
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

export default YapServiceScreeen