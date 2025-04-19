import {
    View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, ScrollView,
    Keyboard, Platform,
    TouchableWithoutFeedback, StyleSheet
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import GaleryCamPopup from '../../components/GaleryCamPopup'
import UploadMediaPopup from '../../components/UploadMediaPopup'
import { Dropdown } from 'react-native-element-dropdown'

import * as ImagePicker from 'expo-image-picker'
import * as VideoThumbnails from 'expo-video-thumbnails';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'


const UploadMediaScreen = ({ navigation, route }) => {

    const from = route.params.from
    let userMedia = []

    const [showPopup, setShowPopup] = useState(false)
    const [showCaptionPopup, setShowCaptionPopup] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')
    const [selectedVideo, setSelectedVideo] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [selectedImageNme, setSelectedImageNme] = useState('')
    const [caption, setCaption] = useState('')

    const [loading, setLoading] = useState(false)
    const [media, setMedia] = useState([])
    const [popupHeight, setPopupHeight] = useState(screenHeight * 0.5)
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deletePosition, setDeletePosition] = useState({ top: 0, left: 50 });
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);

    const threeDotRefs = useRef([]);



    useEffect(() => {
        console.log('media array is', media)
    }, [media])

    useEffect(()=>{
        if(from === "profile"){
            
            userMedia = route.params.media
            setMedia(userMedia)
            console.log('userMedia', userMedia)
        }
    },[route.params])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (event) => {
                console.log('keryboard open')
                setPopupHeight(screenHeight * 0.85)
            }
        );

        const KeyboardDidHideListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            (event) => {
                console.log('keybord hide')
                setPopupHeight(screenHeight * 0.5)

            }
        );
        return () => {
            keyboardDidShowListener.remove();
            KeyboardDidHideListener.remove();
        };
    }, []);


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow Whatyap camera access to complete profile');
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
            setShowCaptionPopup(true)
            setShowPopup(false)

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
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            console.log('Image url recieved is', ImageUrl)
            setShowPopup(false)
            setShowCaptionPopup(true)
            setSelectedImage(ImageUrl)
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


    const uploadMedia = async () => {

        let m = {
            image: thumbnail ? thumbnail : selectedImage,
            caption: caption,
            name: selectedImageNme
        }


        setShowCaptionPopup(false)

        // return

        setLoading(true)
        try {
            let data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)
                console.log('user data is', u)

                let token = u.token

                const formdata = new FormData()

                formdata.append("media", {
                    name: 'media',
                    uri: selectedImage
                })
                formdata.append("caption", caption)
                // formdata.append("name", selectedImageNme)
                thumbnail && (
                    formdata.append("thumbnail", {
                        name: 'thumb',
                        uri: thumbnail
                    })
                )

                console.log('from data is', formdata)
                // return
                const response = await axios.post(Apipath.uploadMedia, formdata, {
                    headers: {
                        "Authorization": 'Bearer ' + token
                    }
                })
                setLoading(false)
                if (response) {
                    setLoading(false)
                    setMedia([...media, response.data.data])
                    console.log('response of upload media is', response.data)
                }
            }
        } catch (e) {
            setLoading(false)
            console.log('error in upload media', e)
        }
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
            const mediaId = mediaItem.id;  // Ensure media items have an `id` property

            setShowDeletePopup(false);
            setSelectedItemIndex(null);
            setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));

            console.log('medaiItem', mediaId)
            // return

            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)

                let apidata = {
                    media_id: mediaId
                }
                let path = Apipath.deleteMedia
                console.log('path', path)

                try {
                    const response = await axios.post(Apipath.deleteMedia, apidata, {
                        headers: {
                            "Authorization": 'Bearer ' + u.token
                        }
                    })

                    if (response.data.status === 200) {

                        // setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaId));
                        console.log("delete media data is", response.data.data);
                    } else {
                        console.log('message is', response.data.message);
                    }
                } catch (error) {
                    console.log('Error deleting media item:', error);
                    console.log('Error', 'An error occurred while trying to delete the media item');
                }
            }
        }
    };

    const getName = (url) => {
        const lastPart = url ? url.split('/').pop() : '';
        console.log(lastPart);
        return lastPart
    }

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {
                loading && (
                    <LoadingAnimation visible={loading} />
                )
            }
            <View style={GlobalStyles.container}>
                <View style={GlobalStyles.completeProfileTopBar}>
                    <TouchableOpacity
                        style={{ opacity: 0 }}
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Image source={require('../../assets/Images/backArrow.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaRegular }}>
                        Complete your profile
                    </Text>


                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, }}>
                        1 of 3
                    </Text>
                </View>

                <View style={{
                    width: screenWidth - 50, alignItems: 'center', flexDirection: 'column',
                    marginTop: 50 / 930 * screenHeight, gap: 10
                }}>
                    <Text style={GlobalStyles.heading24}>
                        Upload Media
                    </Text>

                    <Text style={GlobalStyles.subheading14}>
                        Upload photos or videos of product or service related to your business.
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            setShowPopup(true)
                        }}
                    >
                        <View style={{
                            width: screenWidth - 40, alignItems: 'center', paddingVertical: 10,
                            backgroundColor: Colors.lightGray, gap: 10, marginTop: 20
                        }}>
                            <Image source={require('../../assets/Images/addBtn.png')}
                                style={{ height: 36 / 930 * screenHeight, width: 36 / 430 * screenWidth, resizeMode: 'contain' }}
                            />

                            <Text style={[GlobalStyles.subheading14, { textAlign: 'center' }]}>
                                Upload Video or Image
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={{

                        height: screenHeight * 0.5, width: screenWidth - 40,
                        // borderWidth:1
                    }} showsVerticalScrollIndicator={false}>
                        {
                            media && media.map((item, index) => (
                                <>
                                    <View key={item.id} style={{
                                        width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        marginTop: 20 / 930 * screenHeight
                                    }}>
                                        <Image source={{ uri: item.thumb_url }}
                                            style={{
                                                height: 75 / 930 * screenHeight, width: 73 / 430 * screenWidth, resizeMode: 'contain'
                                            }}
                                        />

                                        <View style={{ width: 270 / 430 * screenWidth, alignItems: 'flex-start', flexDirection: 'column', gap: 8 }}>
                                            {/* <Text style={{
                                                fontSize: 14, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
                                                opacity: 0.7
                                            }}>
                                                {getName(item.url)}
                                            </Text> */}
                                            <Text numberOfLines={2} style={[GlobalStyles.text17, { width: 250 / 430 * screenWidth }]}>
                                                {item.caption}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            ref={(el) => (threeDotRefs.current[index] = el)}
                                            style={{ alignSelf: 'flex-start' }}
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
                                        <View style={{ height: screenHeight, width: screenWidth }}
                                            onPress={Keyboard.dismiss}
                                        >
                                            <TouchableWithoutFeedback onPress={() => {

                                                setShowDeletePopup(false);

                                            }} style={{ height: screenHeight, width: screenWidth, }}
                                            >
                                                {/* <View style={styles.modalOverlay} /> */}
                                                {/* </TouchableWithoutFeedback>  */}

                                                <View style={{ height: screenHeight, width: screenWidth, }}>
                                                    <View style={[styles.deleteModal, { top: deletePosition.top, left: deletePosition.left }]}>
                                                        <TouchableOpacity onPress={() => {
                                                            deleteMediaItem()
                                                        }}>
                                                            <Text style={styles.deleteText}>Delete</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </Modal>
                                </>


                            ))
                        }
                    </ScrollView>
                    <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 0 }]}
                        onPress={() => {
                            if (from === "profile") {
                                navigation.goBack()
                                return
                            }
                            navigation.push(ScreenNames.BusinessIndustryScreen, {
                                from: 'uploadMedia'
                            })
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
                <Modal
                    visible={showCaptionPopup}
                    transparent={true}
                    animationType='slide'
                >
                    <TouchableWithoutFeedback style={{ height: screenHeight, width: screenWidth }}
                        onPress={() => {
                            Keyboard.dismiss()
                        }}
                    >
                        <View style={[GlobalStyles.container, {
                            backgroundColor: '#00000055', justifyContent: 'flex-end'
                        }]}>
                            <View style={{
                                backgroundColor: 'white', alignItems: 'center', height: popupHeight && popupHeight,
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
                                    <Image source={{ uri: thumbnail ? thumbnail : selectedImage }}
                                        style={{
                                            height: 73 / 930 * screenHeight, width: 73 / 430 * screenWidth, resizeMode: 'cover',

                                        }}
                                    />
                                    {/* <Text style={{
                                        fontSize: 14, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
                                        opacity: 0.8
                                    }}>
                                        {selectedImageNme}
                                    </Text> */}

                                </View>
                                <TextInput
                                    multiline
                                    placeholder='caption'
                                    style={[GlobalStyles.input, {
                                        marginTop: 10,
                                        height: 195 / 930 * screenHeight
                                    }]}
                                    onChangeText={(text) => {
                                        setCaption(text)
                                    }}
                                />

                                <TouchableOpacity style={GlobalStyles.capsuleBtn}
                                    onPress={() => {
                                        uploadMedia()
                                        // setShowCaptionPopup(false)
                                    }}
                                >
                                    <Text style={GlobalStyles.BtnText}>
                                        Continue
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

export default UploadMediaScreen

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
        padding: 8,
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