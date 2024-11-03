import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { ScreenNames } from '../../res/ScreenNames'

const ProfileCongratsScreen = ({navigation}) => {
    return (
        <SafeAreaView style = {GlobalStyles.container}>
            <View style={GlobalStyles.container}>
                <View style={{
                    marginTop: 80 / 930 * screenHeight, width: screenWidth - 50, alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                }}>

                    <Image source={require('../../assets/Images/profileCongratsImage.png')}
                        style={{ height: 93 / 930 * screenHeight, width: 105 / 430 * screenWidth, resizeMode: 'contain' }}
                    />
                    <Text style={[GlobalStyles.heading, { textAlign: 'center', }]}>
                        Congrats
                    </Text>
                    <Text style={[GlobalStyles.subheading14, {
                        textAlign: 'center', marginTop: 50,width:screenWidth-80
                    }]}>
                        Lorem ipsum dolor sit amet consectetur. Eleifend blandit erat mus vulputate semper maecenas gravida. Dignissim venenatis quam ultricies nibh feugiat euismod pretium.
                    </Text>

                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={()=>{
                            navigation.push(ScreenNames.TabbarContainer)
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

export default ProfileCongratsScreen