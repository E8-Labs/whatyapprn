import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'
import { Rating } from 'react-native-ratings';
import { ShowMessage } from '../../components/ShowMessage'


const YapScoreScreen = ({ navigation, route }) => {

    const [rating, setRating] = useState(0)
    const [ratingKey, setRatingKey] = useState(0); // Force re-render on rating change
    const [error, setError] = useState("")

    const yap = route.params.yap
    yap.yapScore = rating
    console.log('yap on yap score screen is', yap)


    const ratingCompleted = (newRating) => {
        let roundedRating = Math.round(newRating * 2) / 2; // Ensure half or full star
        console.log("Rounded Rating is: " + roundedRating);

        setRating(roundedRating);
        setRatingKey((prevKey) => prevKey + 1); // Change key to force re-render
        setError(null)
    }


    const handleContinuePress = () => {
        if (rating === 0) {
            setError("Yap score required")
            return
        } else if (rating <= 3) {
            navigation.push(ScreenNames.SattelmentSelectionScreen, {
                yap: yap
            })
        } else {
            navigation.push(ScreenNames.YapExperienceScreen, {
                yap: yap
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
                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, gap: 20 / 930 * screenHeight }}>
                    <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                        Give a YapScore
                    </Text>

                    <Rating
                        type='custom'
                        key={ratingKey} // Ensures UI updates with each change
                        style={{ alignSelf: 'flex-start' }}
                        ratingCount={5}
                        ratingBackgroundColor='#D3D3D3'
                        tintColor='white'
                        ratingColor='#FFC107'
                        imageSize={50}
                        startingValue={rating}
                        fractions={1}
                        showRating={false}
                        onFinishRating={ratingCompleted}

                    />
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

export default YapScoreScreen