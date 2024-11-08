import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import { ShowMessage } from '../../components/ShowMessage'
import { updateProfile } from '../../components/UpdateProfile'


const selectedImage = require('../../assets/Images/selectedIcon.png')
const unselectedImage = require('../../assets/Images/unSelectedIcon.png')

const BusinessIndustryScreen = ({navigation,route}) => {

    const from = route.params.from

    const [selected,setSelected] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    const industries = [
        {
            id: 1,
            name: 'Finance'
        },
        {
            id: 2,
            name: 'Management'
        },
        {
            id: 3,
            name: 'Information & Technology'
        },
        {
            id: 4,
            name: 'Service'
        },
        {
            id: 5,
            name: 'Sales'
        },

    ]

    const handleContinuePress =async () =>{
        if(from === 'profile'){
            let data = {
                business_industry:selected
            }
            setLoading(true)
            await updateProfile(data)
            setLoading(false)
            navigation.goBack()
            return
        }
        if(!selected){
            setError("Select a business industry")
            return
        }
        navigation.push(ScreenNames.EmployeesScreen,{
            user:{
                business_industry:selected,
                from:'industry'
            }
        })
    }

    return (
        <SafeAreaView style = {GlobalStyles.container}>
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
                        2 of 5
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight,gap:10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Business Industry
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Select your business industry
                    </Text>
                    <View style={{ marginTop: 30 / 930 * screenHeight }}>

                        {
                            industries.map((item) => (
                                <TouchableOpacity key={item.id} 
                                    onPress={()=>{
                                        setSelected(item.name)
                                        setError("")
                                    }}
                                >
                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                                        padding: 20, flexDirection: 'row'
                                    }}>
                                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                                            {item.name}
                                        </Text>
                                        <Image source={selected === item.name ? selectedImage : unselectedImage}
                                            style={{
                                                height: 30 / 930 * screenHeight,
                                                width: 30 / 930 * screenHeight
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                        {
                            error && <Text style = {GlobalStyles.errorText}>{error}</Text>
                        }
                    </View>

                    <TouchableOpacity style = {GlobalStyles.capsuleBtn}
                        onPress={handleContinuePress}
                    >
                        <Text style = {GlobalStyles.BtnText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default BusinessIndustryScreen