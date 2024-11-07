import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'

const RoleSelectionScreen = ({ navigation }) => {


    const selectedImage = require('../../assets/Images/selectedIcon.png')
    const unselectedImage = require('../../assets/Images/unSelectedIcon.png')


    const [selected, setSelected] = useState("")

    const roles = [
        {
            id: 1,
            name: 'Customer'
        }, {
            id: 2,
            name: 'Business'
        }
    ]

    const handleContinue = () => {

        let r = ''

        if (selected === 1) {
            r = 'customer'
        } else if (selected === 2) {
            r = 'business'
        }
        navigation.push(ScreenNames.EmailScreen, {
            user: {
                role: r
            }
        })
    }
    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={{ width: screenWidth - 40, alignItems: 'flex-start', marginTop: 30 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image source={require('../../assets/Images/backArrow.png')}
                        style={GlobalStyles.image24}
                    />
                </TouchableOpacity>
                <Text style={[GlobalStyles.heading, { marginTop: 20 }]}>
                    Select account type
                </Text>

                <View style={{ marginTop: 30 / 930 * screenHeight }}>

                    {
                        roles.map((item) => (
                            <TouchableOpacity key={item.id}
                                onPress={() => {
                                    setSelected(item.id)
                                }}
                            >
                                <View style={{
                                    width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                                    padding: 20, flexDirection: 'row'
                                }}>
                                    <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                                        {item.name}
                                    </Text>
                                    <Image source={selected === item.id ? selectedImage : unselectedImage}
                                        style={{
                                            height: 30 / 930 * screenHeight,
                                            width: 30 / 930 * screenHeight
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))
                    }

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={() => {
                            handleContinue()
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

export default RoleSelectionScreen