import {
    View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, ScrollView,
    TouchableWithoutFeedback, StyleSheet
} from 'react-native'
import React, { useState, useRef } from 'react'
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


const YapMediaUploadScreen = ({ navigation, route }) => {

    const [showPopup, setShowPopup] = useState(false)
    const [showCaptionPopup, setShowCaptionPopup] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')
    const [selectedVideo, setSelectedVideo] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [selectedImageNme, setSelectedImageNme] = useState('')
    const [media, setMedia] = useState([])
    const [selectedItemIndex, setSelectedItemIndex] = useState("")
    const [showDeletePopup, setShowDeletePopup] = useState(false)
    const [deletePosition, setDeletePosition] = useState("")

    const threeDotRefs = useRef([]);

    const yap = route.params.yap
    yap.media = media

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow Whatyapp camera access to complete profile');
            return;
        }
        console.log('trying to open galery')
        // setError(null)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            const imageName = result.assets[0].fileName
            console.log('Image recieved is', result)
            setSelectedImage(ImageUrl)
            setSelectedImageNme(imageName)
            let m = {
                url: ImageUrl,
                name: imageName
            }
            setMedia([...media, m])
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
            alert('Please allow Whatyap camera access to complete profile');
            return;
        }
        console.log('trying to open galery')
        // setError(null)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            const imageName = result.assets[0].fileName
            console.log('Image url recieved is', ImageUrl)
            setShowPopup(false)
            // setShowCaptionPopup(true)
            setSelectedVideo(ImageUrl)
            generateThumbnail(ImageUrl, imageName)
            setSelectedImageNme(imageName)
            // setImage(ImageUrl)
            console.log(result.assets[0].uri);
        } else {
            // alert('You did not select any image.');
        }
    }

    const generateThumbnail = async (url, name) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                url,
                {
                    time: 15000,
                }
            );
            setThumbnail(uri);
            let m = {
                url: uri,
                name: name
            }
            setMedia([...media, m])
        } catch (e) {
            console.warn(e);
        }
    };

    const handleContinuePress = () => {

        navigation.push(ScreenNames.YapScoreScreen, {
            yap: yap
        })

    }
    const handleThreeDotPress = (index) => {
        if (threeDotRefs.current[index]) {
            threeDotRefs.current[index].measure((fx, fy, width, height, px, py) => {
                let leftPosition = px;

                // Adjust position if it goes off the screen
                if (px + 70 > screenWidth) {  // Assuming modal width is ~120
                    leftPosition = screenWidth - 80; // Padding to keep modal within bounds
                }

                setDeletePosition({ top: py + height, left: leftPosition });
                setSelectedItemIndex(index);  // Set the index of the selected item
                setShowDeletePopup(true);
            });
        }
    };

    const deleteMediaItem = async () => {
        if (selectedItemIndex !== null) {
            const mediaItem = media[selectedItemIndex];
            // Ensure media items have an `id` property

            setShowDeletePopup(false);
            setSelectedItemIndex(null);
            setMedia(prevMedia => prevMedia.filter(item => item.url !== mediaItem.url));
            setSelectedImage("")
        }
    };


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
                        Add photos of receipts, customers with their purchase, or your business fulfilling a service.
                    </Text>
                    <Text style={[GlobalStyles.subheading14, { marginTop: -10 }]}>
                        Ex. Car purchases, home remodeled, etc.
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setShowPopup(true)
                        }}
                    >
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
                    </TouchableOpacity>

                    <ScrollView style={{
                        height: screenHeight * 0.39, width: screenWidth - 40,
                        // borderWidth:1
                    }} showsVerticalScrollIndicator={false}>
                        {
                            media && media.map((item, index) => (
                                <>
                                    <View key={item.id} style={{
                                        width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        marginTop: 20 / 930 * screenHeight
                                    }}>
                                        <Image source={{ uri: item.url }}
                                            style={{
                                                height: 75 / 930 * screenHeight, width: 73 / 430 * screenWidth, resizeMode: 'contain'
                                            }}
                                        />

                                        <View style={{ width: 270 / 430 * screenWidth, alignItems: 'flex-start', flexDirection: 'column', gap: 8 }}>
                                            {/* <Text style={{
                                                fontSize: 14, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
                                                opacity: 0.7
                                            }}>
                                                {item.name}
                                            </Text> */}
                                            {/* <Text numberOfLines={2} style={[GlobalStyles.text17, { width: 250 / 430 * screenWidth }]}>
                                                {item.caption}
                                            </Text> */}
                                        </View>
                                        <TouchableOpacity
                                            ref={(el) => (threeDotRefs.current[index] = el)}
                                            style={{}}
                                            onPress={() => handleThreeDotPress(index)}
                                        >
                                            <Image source={require('../../assets/Images/threeDotsImage.png')}
                                                style={GlobalStyles.image24}
                                            />
                                        </TouchableOpacity>

                                        {/* delete popup */}



                                    </View>
                                    <Modal
                                        visible={showDeletePopup}
                                        transparent={true}
                                        animationType='fade'
                                    >
                                        <TouchableWithoutFeedback onPress={() => {
                                            // console.log('pressed')
                                            setShowDeletePopup(false)
                                        }} style={{ height: screenHeight, width: screenWidth }}
                                        >
                                            <View style={{ height: screenHeight, width: screenWidth }}>

                                                <View style={[styles.deleteModal, { top: deletePosition.top, left: deletePosition.left }]}>
                                                    <TouchableOpacity onPress={() => {
                                                        deleteMediaItem()
                                                    }}>
                                                        <Text style={styles.deleteText}>Delete</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>

                                    </Modal>
                                </>


                            ))
                        }
                    </ScrollView>

                    <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 0 }]}
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
        </SafeAreaView >
    )
}

export default YapMediaUploadScreen

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    deleteModal: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    deleteText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold'
    }
})