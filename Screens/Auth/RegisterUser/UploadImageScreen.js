import { View, Text, TouchableOpacity, Image, SafeAreaView, TextInput, StyleSheet, Modal } from 'react-native'
import React, { useRef, useState } from 'react'

import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { Colors } from '../../../res/Colors'
import { ScreenNames } from '../../../res/ScreenNames'
import GaleryCamPopup from '../../../components/GaleryCamPopup'

import * as ImagePicker from 'expo-image-picker';
import { ShowMessage } from '../../../components/ShowMessage'

const UploadImageScreen = ({ navigation, route }) => {

    const [showPopup, setShowPopup] = useState(false)
    const [image, setImage] = useState('')
    const [username, setUsername] = useState('')
    const [error,setError] = useState("")

    const user = route.params.user
    user.username = username,
        user.media = image
    console.log('user on image screen is', user)

    const handleContinuePress = () => {

        if (!username) {
            setError("Business name required")
            return
        }
        navigation.push(ScreenNames.BusinessWebScreen, {
            user: user,
            from:'UploadImage'
        })
    }

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow Whatyapp gallery access to complete profile');
            return;
        }
        console.log('trying to open galery')
        // setError(null)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            console.log('Image url recieved is', ImageUrl)
            setShowPopup(false)
            setImage(ImageUrl)
            console.log(result.assets[0].uri);
        } else {
            // alert('You did not select any image.');
        }
    }

    const captureImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow Whatyap camera access to complete profile');
            return;
        }


        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            // console.log("Base 64 image ", result.assets[0].base64)
            console.log('Image url recieved is', ImageUrl)
            // setPopup(false)
            setImage(ImageUrl)
            // generateThumbnail(ImageUrl)
            console.log(result.assets[0].uri);
        } else {
            // setPopup(false)
            // alert('You did not select any video.');
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.container}>

                <View style={GlobalStyles.completeProfileTopBar}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Image source={require('../../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        3 of 5
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column', gap: 30 / 930 * screenHeight,
                    marginTop: 50 / 930 * screenHeight,
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Upload Photo
                    </Text>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        width: screenWidth - 50
                    }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, width: 270 / 430 * screenWidth, }}>

                            <TouchableOpacity onPress={() => {
                                if(!image){
                                    setShowPopup(true)
                                }
                            }}>
                                <Image source={image ? { uri: image } : require('../../../assets/Images/placeholderImage.png')}
                                    style={{
                                        height: 88 / 930 * screenHeight,
                                        width: 88 / 430 * screenWidth,
                                        resizeMode: 'cover',
                                        borderRadius: 50
                                    }}
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'column', gap: 10 / 930 * screenHeight }}>
                                <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                                    Upload profile photo
                                </Text>
                                <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: "#00000050" }}>
                                    Max size is 2mb
                                </Text>

                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                if(!image){
                                    setShowPopup(true)
                                }
                            }}
                        >
                            <Image source={require('../../../assets/Images/cameraImage.png')}
                                style={{ width: 40 / 430 * screenWidth, height: 40 / 930 * screenHeight, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder='*Business Name'
                        style={GlobalStyles.input}
                        onFocus={()=>{
                            setShowPopup(false)
                        }}
                        onChangeText={(text) => {
                            setUsername(text)
                            setError("")
                        }}
                    />

                    {/* {
                        !username && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: Colors.lightBlack }}>*</Text>
                                <Text style={{
                                    fontSize: 13, fontFamily: CustomFonts.InterRegular, textAlign: 'left', width: screenWidth - 60,
                                    marginTop: -20 / 930 * screenHeight, color: Colors.lightBlack, alignSelf: 'flex-end'
                                }}>
                                    Required
                                </Text>
                            </View>
                        )
                    } */}

                    {
                        error && <Text style = {GlobalStyles.errorText}>{error}</Text>
                    }



                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                        onPress={handleContinuePress}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Continue
                        </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        onPress={() => {
                            navigation.push(ScreenNames.PasswordScreen)
                        }}
                    >
                        <Text style={[GlobalStyles.BtnText, { color: 'blaack' }]}>
                            Skip
                        </Text>
                    </TouchableOpacity> */}
                </View>

                <Modal
                    visible={showPopup}
                    transparent={true}
                    animationType='slide'
                >
                    <GaleryCamPopup close={() => {
                        setShowPopup(false)

                    }}
                        handleBtnPress={(value) => {
                            console.log('button pressed', value)
                            if (value === "galery") {
                                pickImage()
                            } else if (value === "camera") {
                                captureImage()
                            }
                        }}

                    />

                </Modal>
            </View>
        </SafeAreaView>
    )
}

export default UploadImageScreen