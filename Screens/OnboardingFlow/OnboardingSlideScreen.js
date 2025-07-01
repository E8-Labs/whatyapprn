import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { ScreenNames } from '../../res/ScreenNames'

const image1 = require('../../assets/Images/onboardingProgress1.png')
const image2 = require('../../assets/Images/onboardingProgress2.png')
const image3 = require('../../assets/Images/onboardingProgress3.png')


export default function OnboardingSlideScreen({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrolRef = useRef(null)

    const slideImages = [
        {
            id: 1,
            image: require('../../assets/Images/onboarding1.png'),
            heading: 'Your trusted partner for customer validation.',
            subheading: 'Quickly verify customer reliability and enhance your business decision-making.'
        },
        {
            id: 2,
            image: require('../../assets/Images/onboarding2.png'),
            heading: 'Comprehensive Customer Profiles',
            subheading: 'Make informed decisions with reliable customer data at your fingertips.'
        },
        {
            id: 3,
            image: require('../../assets/Images/onboarding3.png'),
            heading: 'WhatYap Pro Subscription Plans',
            subheading: 'Verify customers, and resolve disputes fast. Provides trust and security for your business. ',
        }
    ]

    const getItemlayout = (index) => ({
        length: width,
        offset: width * index,
        index: index
    })

    useEffect(() => {
        console.log("Current index is ", currentIndex)
        scrolRef.current.scrollTo({ x: (currentIndex) * screenWidth, animated: true });
    }, [currentIndex])

    const handleNext = () => {
        if (currentIndex < 2) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate(ScreenNames.LoginScreen)
        }

    }
    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            return
            // props.navigation.navigate("LoginUser")
        }

    }

    const getProgressImage = (index) => {
        if (index === 0) {
            return image1
        }
        if (index === 1) {
            return image2
        }
        if (index === 2) {
            return image3
        }
    }


    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.container}>
                <View style={{ width: screenWidth, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5 }}>
                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium }}>
                        {currentIndex + 1} of 3
                    </Text>
                    <Image source={getProgressImage(currentIndex)}
                        style={{ height: 3, width: 66 }}
                    />
                    <ScrollView
                        ref={scrolRef}
                        horizontal
                        pagingEnabled={true}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        getItemlayout={getItemlayout}
                    >
                        {
                            slideImages.map((item) => (
                                <View key={item.id} style={{ width: screenWidth, alignItems: 'center' }}>
                                    <View style={{ width: screenWidth - 30, flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                        <Image source={item.image}
                                            style={{ height: 430 / 930 * screenHeight, width: 320 / 430 * screenWidth, marginTop: 8 / 930 * screenHeight }}
                                        />

                                        <Text style={GlobalStyles.heading}>
                                            {item.heading}
                                        </Text>

                                        <Text style={GlobalStyles.subheading}>
                                            {item.subheading}
                                        </Text>

                                    </View>
                                </View>
                            ))
                        }


                    </ScrollView>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' ,marginTop:20}}>
                        {
                            currentIndex > 0 ? (
                                <TouchableOpacity
                                    onPress={handleBack}
                                >
                                    <Text style={[GlobalStyles.BtnText, { color: '#000' }]}>
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View></View>
                            )
                        }

                        <TouchableOpacity style={[GlobalStyles.rectButton, {
                            marginTop: 0 / 930 * screenHeight,
                        }]}
                            onPress={handleNext}
                        >
                            <Text style={GlobalStyles.BtnText}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity //style={[GlobalStyles.rectButton, {  }]}
                        onPress={() => {
                            navigation.navigate(ScreenNames.LoginScreen)
                        }}
                    >
                        <Text style={[GlobalStyles.BtnText, { color: '#000', alignSelf: 'center', marginTop: 20 / 930 * screenHeight }]}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
}