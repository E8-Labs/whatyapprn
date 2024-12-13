import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../assets/styles/GlobalStyles'  
import { screenHeight, screenWidth } from '../res/Constants'

const MessagePopup = ({ closeModal }) => {
    return (
        <View style={[GlobalStyles.container, { backgroundColor: '#00000055', justifyContent: 'flex-end' }]}>
            <View style={{ width: screenWidth, alignItems: 'center',backgroundColor: 'white', }}>
                <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 / 430 * screenWidth, marginTop: 30 / 930 * screenHeight }}>
                        <Text style={[GlobalStyles.text17, { color: '#00000080' }]}>
                            To:
                        </Text> 

                        <Image source={require('../assets/Images/profileImage.png')}
                            style={GlobalStyles.image24}
                        />

                        <Text style={GlobalStyles.text17}>
                            James Leight
                        </Text>
                    </View>

                    <TouchableOpacity 
                        onPress={closeModal}
                    >
                        <Image source={require('../assets/Images/crossIcon.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={GlobalStyles.heading24}>
                    Write Message
                </Text>

                <TextInput
                    multiline
                    placeholder='Type here'
                    style={[GlobalStyles.input,{height:140/930*screenHeight}]}

                />
                <TouchableOpacity style = {[GlobalStyles.capsuleBtn,{marginBottom:30}]}
                    onPress={()=>closeModal()}
                >
                    <Text style = {GlobalStyles.BtnText}>
                        Send Message (1 Credit)
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default MessagePopup