import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../res/Constants'
import { Colors } from '../res/Colors'

const UploadMediaPopup = ({ close, handleBtnPress }) => {
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
                        Which file do you want to upload?
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
                            handleBtnPress("video")
                        }}
                    >
                        <View style={GlobalStyles.popupBtn}>
                            <Image source={require('../assets/Images/videoIcon.png')}
                                style={GlobalStyles.image37}
                            />
                            <Text style={[GlobalStyles.text17, { marginTop: 25 / 930 * screenHeight }]}>
                                Video
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            handleBtnPress("image")
                        }}
                    >
                        <View style={GlobalStyles.popupBtn}>
                            <Image source={require('../assets/Images/galeryIcon.png')}
                                style={GlobalStyles.image37}
                            />
                            <Text style={[GlobalStyles.text17, { marginTop: 25 / 930 * screenHeight }]}>
                                Image
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

export default UploadMediaPopup