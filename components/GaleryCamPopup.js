import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../res/Constants'
import { Colors } from '../res/Colors'

const GaleryCamPopup = ({ close, handleBtnPress }) => {
    return (
        <View style={[GlobalStyles.container, {
            backgroundColor: '#00000055', justifyContent: 'flex-end'
        }]}>
            <View style={{
                backgroundColor: 'white', alignItems: 'center',
                paddingVertical: 20, width: screenWidth, paddingHorizontal: 20
            }}>

                <View style={{ width: screenWidth - 40, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 / 930 * screenHeight }}>
                    <Text style={GlobalStyles.text17}>
                        Select one of the options
                    </Text>
                    <TouchableOpacity onPress={close}>
                        <Image source={require('../assets/Images/crossIcon.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ width: screenWidth - 60, flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight }}>

                    <TouchableOpacity
                        onPress={() => {
                            handleBtnPress("camera")
                        }}
                    >
                        <View style={GlobalStyles.popupBtn}>
                            <Image source={require('../assets/Images/videoIcon.png')}
                                style={GlobalStyles.image37}
                            />
                            <Text style={[GlobalStyles.text17, { marginTop: 25 / 930 * screenHeight }]}>
                                Camera
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            handleBtnPress("galery")
                        }}
                    >
                        <View style={GlobalStyles.popupBtn}>
                            <Image source={require('../assets/Images/galeryIcon.png')}
                                style={GlobalStyles.image37}
                            />
                            <Text style={[GlobalStyles.text17, { marginTop: 25 / 930 * screenHeight }]}>
                                Gallery
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[GlobalStyles.capsuleBtn, { backgroundColor: Colors.lightGray }]}
                    onPress={close}
                >
                    <Text style={[GlobalStyles.BtnText, { color: 'black' }]}>
                        Cancel
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default GaleryCamPopup