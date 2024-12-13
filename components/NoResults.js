import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { screenHeight, screenWidth } from '../res/Constants'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { ScreenNames } from '../res/ScreenNames'

const NoResults = ({navigation}) => {
    return (
        <View style={{
            marginTop: 50 / 930 * screenHeight, flexDirection: 'column', alignItems: 'center', width: screenWidth,
            gap: 30 / 930 * screenHeight
        }}>
            <Image source={require('../assets/Images/noResultsIcon.png')}
                style={{ height: 99 / 930 * screenHeight, width: 93 / 430 * screenWidth, resizeMode: 'contain' }}
            />

            <Text style = {[GlobalStyles.text17,{width:250/430*screenWidth,textAlign:'center'}]}>
                Looks like there's no customer with that name
            </Text>

            <TouchableOpacity style = {GlobalStyles.capsuleBtn}
                onPress={()=>{
                    navigation.push(ScreenNames.EmailScreen,{
                        user: {
                            role:'customer'
                        }
                    })
                }}
            >
                <Text style = {GlobalStyles.BtnText}>
                    Add New Customer                    
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default NoResults