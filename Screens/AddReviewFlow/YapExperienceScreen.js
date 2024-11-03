import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'



const YapExperienceScreen = ({ navigation ,route}) => {

    const yap = route.params.yap
    console.log('yap on experience screen is', yap)

    const [experience,setExperience] = useState("")
    const [loading,setLoading] = useState(false)

    const handleContinuePress = async () =>{
        if(!experience){
            ShowMessage("Tell us your experience ealing with this customer")
            return 
        }
        setLoading(true)
        try{
            const data = await AsyncStorage.getItem("USER")
            if(data){
                let u = JSON.parse(data)

               

                let apidata = new FormData()

                apidata.append("service",yap.service)
                apidata.append("amountOfTransaction",yap.transactionAmount)
                apidata.append("dateOfTransaction",yap.dateOfTransaction)
                apidata.append("yapScore",yap.yapScore)
                apidata.append("settlementOffer",yap.settlementOffer)
                apidata.append("notesAboutCustomer",experience)
                apidata.append("settlementAmount",yap.settlementAmount)
                apidata.append("customerId",yap.user.id)
                apidata.append("media", {
                    name: "imageName",
                    uri: yap.media,
                });

                console.log('apidata is', apidata)
                // return
 
                const response = await axios.post(Apipath.addYap,apidata,{
                    headers:{
                        'Authorization':'Bearer '+ u.token,
                    }
                })
                // console.log('response', response)

                if(response.data){
                    setLoading(false)
                    if(response.data.status === true){
                        console.log('yad add data', response.data.data)
                        ShowMessage("Congrats! yap added successfully",'green')
                        if(yap.settlementAmount){
                            navigation.pop(8)
                        }else{
                            navigation.pop(7)
                        }
                    }else{
                        console.log('add response message is', response.data.message)
                        ShowMessage(response.data.message)
                    }
                }
            }
        }catch(e){
            setLoading(false)
            console.log('error in add yap is', e)
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && (
                    <LoadingAnimation visible = {loading} />
                )
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
                        Create Yap!
                    </Text>
                    <View></View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        What was your experience dealing with this customer?
                    </Text>
                    <Text style={[GlobalStyles.text14, { alignSelf: 'flex-start' }]}>  This will be posted for the public to see
                    </Text>

                    <TextInput
                        multiline
                        onChangeText={(text)=>{
                            setExperience(text)
                        }}
                        placeholder='Type here'
                        placeholderTextColor={'black'}
                        style={[GlobalStyles.input, { height: 140 / 930 * screenHeight }]}
                    />

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                            handleContinuePress()
                        }}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Save & Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>

    )
}

export default YapExperienceScreen