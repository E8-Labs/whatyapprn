import { View, Text, Modal, TouchableOpacity,Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { screenHeight, screenWidth } from '../res/Constants'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { Colors } from '../res/Colors'

const ConfirmationPopup = ({
    showConfirmationPopup,
    setShowConfirmationPopup,
    loading,
    onContinue,
}) => {
    return (
        <View>
            <Modal
                visible={showConfirmationPopup}
                animationType="slide"
                transparent={true}
            >
                <View style={{
                    height: screenHeight, width: screenWidth, backgroundColor: '#00000050', alignItems: 'center'
                    , justifyContent: 'center'
                }}>
                    <View style={{
                        height: screenHeight * 0.25, width: screenWidth - 40, alignItems: 'center', borderRadius: 20,
                        flexDirection: 'column', alignItems: 'center', gap: 30, backgroundColor: 'white', padding: 20
                    }}>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={[GlobalStyles.text17, { color: 'black', fontWeight: '700' }]}>
                                Delete Account
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setShowConfirmationPopup(false)
                            }}>
                                <Image source={require("../assets/Images/crossIcon.png")}
                                    style={GlobalStyles.image24}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={[GlobalStyles.text17, { color: 'black', fontWeight: '700', textAlign: 'left' }]}>
                            Are you sure? You want to delete account.
                        </Text>


                        <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => {
                                setShowConfirmationPopup(false)
                            }}>
                                <Text style={GlobalStyles.text17}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            {
                                loading ? (
                                    <ActivityIndicator size={'large'} color={Colors.orangeColor} />
                                ) : (
                                    <TouchableOpacity style={[GlobalStyles.capsuleBtn, { width: 150, marginTop: 0 }]}
                                        onPress={() => { onContinue() }}
                                    >
                                        <Text style={GlobalStyles.BtnText}>
                                            Continue
                                        </Text>
                                    </TouchableOpacity>

                                )
                            }

                        </View>

                    </View>
                </View>

            </Modal>
        </View>
    )
}

export default ConfirmationPopup