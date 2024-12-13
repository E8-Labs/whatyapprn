import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'


const selectedImage = require('../../assets/Images/selectedIcon.png')
const unselectedImage = require('../../assets/Images/unSelectedIcon.png')

const SattelmentSelectionScreen = ({ navigation, route }) => {

    const [selected, setSelected] = useState(null)

    const yap = route.params.yap

    const offers = [
        {
            id: 1,
            name: 'Yes'
        }, {
            id: 2,
            name: 'No'
        },


    ]

    useEffect(() => {
        const handleOfferSelection = () => {
            if (selected === 1) {
                yap.settlementOffer = true

            } else {
                yap.settlementOffer = false

            }
        }
        handleOfferSelection()
    }, [selected])

    const handleContinuePress = () => {
        if (selected === 1) {
            navigation.push(ScreenNames.SattlementAmountScreen,{
                yap:yap
            })

        } else if (selected === 2) {
            navigation.push(ScreenNames.YapExperienceScreen,{
                yap:yap
            })

        }
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


                    <View></View>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight, gap: 10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Settlement Offer
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Do you wish to settle your negative experience with this customer?
                    </Text>
                    <View style={{ marginTop: 30 / 930 * screenHeight }}>

                        {
                            offers.map((item) => (
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
                    </View>

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

export default SattelmentSelectionScreen