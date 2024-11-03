import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import GaleryCamPopup from '../../components/GaleryCamPopup'
import UploadMediaPopup from '../../components/UploadMediaPopup'

import * as ImagePicker from 'expo-image-picker'
import * as VideoThumbnails from 'expo-video-thumbnails';
import { ShowMessage } from '../../components/ShowMessage'


const YapMediaUploadScreen = ({ navigation ,route}) => {

    const [showPopup, setShowPopup] = useState(false)
    const [showCaptionPopup, setShowCaptionPopup] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')
    const [selectedVideo, setSelectedVideo] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [selectedImageNme, setSelectedImageNme] = useState('')

    const yap = route.params.yap
    yap.media=selectedImage?selectedImage:selectedVideo

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow Soulmatch camera access to complite profile');
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
            const imageName = result.assets[0].fileName
            console.log('Image recieved is', result)
            setSelectedImage(ImageUrl)
            setSelectedImageNme(imageName)
            // setShowCaptionPopup(true)
            setShowPopup(false)

            // setImage(ImageUrl)
            // console.log(result.assets[0].uri);
        } else {
            // alert('You did not select any image.');
        }
    }

    const pickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow Soulmatch camera access to complite profile');
            return;
        }
        console.log('trying to open galery')
        // setError(null)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            console.log('Image url recieved is', ImageUrl)
            setShowPopup(false)
            // setShowCaptionPopup(true)
            setSelectedVideo(ImageUrl)
            generateThumbnail(ImageUrl)
            // setImage(ImageUrl)
            console.log(result.assets[0].uri);
        } else {
            // alert('You did not select any image.');
        }
    }

    const generateThumbnail = async (url) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                url,
                {
                    time: 15000,
                }
            );
            setThumbnail(uri);
        } catch (e) {
            console.warn(e);
        }
    };

    const handleContinuePress = () =>{
        // if(!selectedImage || !selectedVideo){
        //     ShowMessage("Upload media")
        //     return
        // }
        navigation.push(ScreenNames.YapScoreScreen,{
            yap:yap
        })

    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.container}>
                <View style={GlobalStyles.completeProfileTopBar}>
                    <TouchableOpacity
                        // style = {{opacity:0}}
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

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight, gap: 10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Upload Media
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Add photos of receipts, customers with their purchase, or your business fulfilling a service.Ex. Car purchases, home remodeled, etc.
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            setShowPopup(true)
                        }}
                    >
                        {
                            selectedImage ? (
                                <Image source={{ uri: selectedImage }}
                                    style={{ width: 384 / 430 * screenWidth, height: 169 / 930 * screenHeight }}
                                />
                            ) : (
                                thumbnail ? (
                                    <Image source={{ uri: selectedImage }}
                                        style={{ width: 384 / 430 * screenWidth, height: 169 / 930 * screenHeight,resizeMode:'contain' }}
                                    />
                                ) : (
                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', paddingVertical: 10, height: 170 / 930 * screenHeight,
                                        backgroundColor: Colors.lightGray, gap: 10, marginTop: 20, justifyContent: 'center'
                                    }}>
                                        <Image source={require('../../assets/Images/addBtn.png')}
                                            style={{ height: 36 / 930 * screenHeight, width: 36 / 430 * screenWidth, resizeMode: 'contain' }}
                                        />

                                        <Text style={[GlobalStyles.subheading14, { textAlign: 'center' }]}>
                                            Upload Media
                                        </Text>
                                    </View>
                                )
                            )
                        }

                    </TouchableOpacity>

                    <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 20 }]}
                        onPress={() => {
                            handleContinuePress()
                        }}
                    >
                        <Text style={GlobalStyles.BtnText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Galery popup */}

                <Modal
                    visible={showPopup}
                    transparent={true}
                    animationType='slide'
                >
                    <UploadMediaPopup
                        close={() => {
                            setShowPopup(false)
                        }}
                        handleBtnPress={(value) => {
                            if (value === "image") {
                                pickImage()
                            } else if (value === "video") {
                                pickVideo()
                            }
                        }}
                    />
                </Modal>

                {/* caption popup */}
                {/* <Modal
                    visible={showCaptionPopup}
                    transparent={true}
                    animationType='slide'
                >
                    <View style={[GlobalStyles.container, {
                        backgroundColor: '#00000055', justifyContent: 'flex-end'
                    }]}>
                        <View style={{
                            backgroundColor: 'white', alignItems: 'center',
                            paddingVertical: 20, width: screenWidth, paddingHorizontal: 20
                        }}>

                            <View style={{ width: screenWidth - 40, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 / 930 * screenHeight }}>
                                <Text style={GlobalStyles.text17}>
                                    Provide Caption
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    setShowCaptionPopup(false)
                                }}>
                                    <Image source={require('../../assets/Images/crossIcon.png')}
                                        style={GlobalStyles.image24}
                                    />
                                </TouchableOpacity>
                            </View>


                            <View style={{ width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, justifyContent: 'flex-start' }}>
                                <Image source={{ uri: selectedImage ? selectedImage : thumbnail }}
                                    style={{
                                        height: 73 / 930 * screenHeight, width: 73 / 430 * screenWidth, resizeMode: 'cover',

                                    }}
                                />
                                <Text style={{
                                    fontSize: 14, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
                                    opacity: 0.8
                                }}>
                                    {selectedImageNme}
                                </Text>

                            </View>
                            <TextInput
                                multiline
                                placeholder='caption'
                                style={[GlobalStyles.input, {
                                    marginTop: 10,
                                    height: 195 / 930 * screenHeight
                                }]}
                            />

                            <TouchableOpacity style={GlobalStyles.capsuleBtn}
                                onPress={() => {
                                    setShowCaptionPopup(false)
                                }}
                            >
                                <Text style={GlobalStyles.BtnText}>
                                    Continue
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}
            </View>
        </SafeAreaView>
    )
}

export default YapMediaUploadScreen