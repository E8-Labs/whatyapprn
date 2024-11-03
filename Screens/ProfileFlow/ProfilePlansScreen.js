import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import React, { useState } from 'react'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'

const ProfilePlansScreen = ({navigation}) => {

    const [selectedPlan, setselectedPlan] = useState({
        id: 1,
        name: "YEARLY",
        price: '$999/yr',
        disc: '12Months at $50/Month'
    })

    const selectedImage = require('../../assets/Images/selectedIcon.png')
    const unSelectedImage = require('../../assets/Images/unSelectedIcon.png')


    const plans = [
        {
            id: 1,
            name: "YEARLY",
            price: '$999/yr',
            disc: '12Months at $50/Month'
        },
        {
            id: 2,
            name: "MONTHLY",
            price: '$999/m',
            disc: ''
        }
    ]

    const billingHistory = [
        {
            id: 1,
            date: '01/10/2023',
            plan: 'Monthly',
            amount: '$7.99'
        },
        {
            id: 2,
            date: '01/10/2023',
            plan: 'Monthly',
            amount: '$7.99'
        },
        {
            id: 3,
            date: '01/10/2023',
            plan: 'Monthly',
            amount: '$7.99'
        },
        {
            id: 4,
            date: '01/10/2023',
            plan: 'Monthly',
            amount: '$7.99'
        },
        {
            id: 5,
            date: '01/10/2023',
            plan: 'Monthly',
            amount: '$7.99'
        },
        {
            id: 6,
            date: '01/10/2023',
            plan: 'Monthly',
            amount: '$7.99'
        },
    ]


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
                        Plans
                    </Text>
                    <View></View>
                </View>
                <View style={{ height: 0.85 * screenHeight, alignItems: 'center', }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{ marginTop: 20 / 930 * screenHeight }}>

                            {
                                plans.map((item) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => {
                                            setselectedPlan(item)
                                        }}
                                    >
                                        {
                                            item.id === 1 && (
                                                <Image source={require('../../assets/Images/recommendedImage.png')}
                                                    style={{
                                                        height: 30 / 930 * screenHeight, width: 164 / 430 * screenWidth, resizeMode: 'contain',
                                                        zIndex: 2, alignSelf: 'center', marginRight: 30 / 430 * screenWidth, marginBottom: -45 / 930 * screenHeight,
                                                    }}
                                                />
                                            )
                                        }
                                        <View style={{
                                            borderWidth: 1, borderColor: selectedPlan.id === item.id ? Colors.orangeColor : Colors.grayColor,
                                            borderRadius: 5, alignItems: 'center',
                                            paddingVertical: 15, paddingHorizontal: 10, marginTop: 30 / 930 * screenHeight,
                                            zIndex: 1
                                        }}>
                                            <View style={{ width: screenWidth - 80 / 430 * screenWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                                                    <Text style={{
                                                        fontSize: 17, fontFamily: CustomFonts.PoppinsSemiBold, fontWeight: '700',
                                                        color: Colors.orangeColor
                                                    }}>
                                                        {item.name}
                                                    </Text>

                                                    <Text style={{
                                                        fontSize: 17, fontFamily: CustomFonts.PoppinsSemiBold, fontWeight: '700',
                                                        color: "black"
                                                    }}>
                                                        {item.price}
                                                    </Text>
                                                </View>


                                                <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 15, justifyContent: 'center' }}>

                                                    <Image source={selectedPlan.id === item.id ? selectedImage : unSelectedImage}
                                                        style={GlobalStyles.image24}
                                                    />
                                                    <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterRegular, }}>
                                                        {item.disc}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                ))
                            }
                        </View>

                        <TouchableOpacity style={GlobalStyles.capsuleBtn}
                            onPress={()=>{
                                navigation.push(ScreenNames.BuyCreditScreen)
                            }}
                        >
                            <Text style={GlobalStyles.BtnText}>
                                Upgrade Plan
                            </Text>
                        </TouchableOpacity>


                        <View style={{
                            width: screenWidth - 20, alignItems: 'flex-start', paddingVertical: 15 / 930 * screenHeight,
                            borderWidth: 1, borderRadius: 10, borderColor: "#EAEAEA", marginTop: 50 / 930 * screenHeight,
                        }}>
                            <Text style={[GlobalStyles.text17, { paddingLeft: 20 / 430 * screenWidth }]}>
                                Billing History
                            </Text>

                            <View style={{
                                width: 370 / 430 * screenWidth, height: 60 / 930 * screenHeight, alignItems: 'center', justifyContent: 'space-between',
                                flexDirection: 'row', backgroundColor: '#F5F5F5', paddingHorizontal: 20 / 430 * screenWidth, marginTop: 25 / 930 * screenHeight,
                                alignSelf: 'center'
                            }}>
                                <Text style={GlobalStyles.text17}>
                                    Plan
                                </Text>

                                <Text style={GlobalStyles.text17}>
                                    Date
                                </Text>

                                <Text style={GlobalStyles.text17}>
                                    Amount
                                </Text>

                            </View>

                            <View style={{
                                flexDirection: 'column', alignItems: 'center', gap: 10 / 930 * screenHeight, marginTop: 25 / 930 * screenHeight
                            }}>
                                {
                                    billingHistory.map((item, index) => (
                                        <>
                                            <View key={item.id} style={{
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 370 / 430 * screenWidth,
                                                paddingHorizontal: 20 / 430 * screenWidth, marginTop: 10 / 930 * screenHeight
                                            }}>
                                                <Text style={GlobalStyles.text17}>
                                                    {item.plan}
                                                </Text>

                                                <Text style={GlobalStyles.text17}>
                                                    {item.date}
                                                </Text>

                                                <Text style={GlobalStyles.text17}>
                                                    {item.amount}
                                                </Text>
                                            </View>
                                            {
                                                index + 1 !== billingHistory.length && (
                                                    <View style={[GlobalStyles.divider, { width: screenWidth - 20, paddingLeft: -20 }]}></View>

                                                )
                                            }

                                        </>

                                    ))
                                }
                            </View>


                        </View>
                        <TouchableOpacity style={{ marginTop: 60 / 930 * screenHeight, alignSelf: 'center' }}>
                            <Text style={[GlobalStyles.BtnText, { color: 'red' }]}>
                                Cancel Subscription
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProfilePlansScreen