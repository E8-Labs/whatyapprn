import { View, Text, Image, TouchableOpacity, SafeAreaView, FlatList, Modal, ActivityIndicator, DeviceEventEmitter } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { ScreenNames } from '../../res/ScreenNames'
import HalfCircularProgress from '../../components/HalfCircularProgressBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProfileRecentReviews from '../../components/ProfileRecentReviews'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import { ReviewTypes } from '../../res/ReviewsTypes'
import LoadingAnimation from '../../components/LoadingAnimation'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment'
import GaleryCamPopup from '../../components/GaleryCamPopup'
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../../components/UpdateProfile'
import { ImageViewer } from '../../components/ImageViewer'
import { ShowMessage } from '../../components/ShowMessage'
import ConfirmationPopup from '../../components/ConfirmationPopup'


const CustomerProfileDetails = (props) => {

    const navigation = useNavigation();
    const route = useRoute();

    const userFromProps = props.user;

    const usr = route.params?.user || userFromProps;
    const [user, setUser] = useState(usr);


    const [role, setRole] = useState("")
    const [selectedMenu, setselectedMenu] = useState({

        id: 1,
        name: "Active",
        value: ReviewTypes.Active
    })
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false);
    const [showGalleryPopup, setShowGalleryPopup] = useState(false)
    const [image, setImage] = useState('')
    const [imageLoader, setImageLoader] = useState(false)

    const [showImage, setShowImage] = useState(null)
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)



    const menues = [
        {
            id: 1,
            name: "Active",
            value: ReviewTypes.Active
        },
        {
            id: 2,
            name: "Past",
            value: ReviewTypes.Past
        },
    ]

    useEffect(() => {
        const checkUserRole = async () => {
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)
                setRole(u.user.role)
                console.log('user data in user role function is', u.user.role)
            }
        }

        checkUserRole()
    }, [])



    useEffect(() => {
        const updateUser = () => {
            if (usr) {
                setUser(usr)
                console.log('user updated on profile screen', usr.yapScore3Digit)
            }
        }

        updateUser()
    }, [usr])

    // let user = role && role === "business" ? usr.viewed : usr
    console.log('user on prfile datails screen ', user.yapScore3Digit)

    useFocusEffect(
        useCallback(() => {
            getReviews()
        }, [selectedMenu])
    )

    const getReviews = async () => {
        try {
            setLoading(true)
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)
                let path = Apipath.getReviews + "?userId=" + user.id + "&reviewStatus=" + selectedMenu.value
                // console.log('object', p)
                console.log('path is ', path)
                const response = await axios.get(path, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token
                    }
                })

                if (response.data) {
                    setLoading(false)
                    if (response.data.status === true) {
                        console.log('reviews are', response.data.data)
                        if (response.data.data) {
                            setReviews(response.data.data)

                        }
                    } else {
                        console.log('get reviews api message is ', response.data.message)
                    }
                }
            }
        } catch (e) {
            console.log('error in get reviews api ', e)
        }
    }

    const logoutUser = async () => {

        AsyncStorage.removeItem("USER")
        navigation.replace(ScreenNames.LoginScreen)
    }

    const deletePermanently = async (review) => {
        setLoading(true)
        // setShowPopup(false)
        const data = await AsyncStorage.getItem("USER")
        if (data) {
            let u = JSON.parse(data)
            let apidata = {
                reviewId: review.id
            }
            console.log('apidata', apidata)
            // return
            try {
                const response = await axios.post(Apipath.hideFromPlatform, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                        'Content-Type': 'application/json'
                    }
                })
                setLoading(false)
                if (response.data) {
                    if (response.data.status === true) {
                        console.log('delete account api data', response.data.data)
                        filteredReviews = reviews.filter(item => review.id !== item.id)
                        console.log('filteredReviews', filteredReviews)
                        setReviews(filteredReviews)
                    } else {
                        console.log('delete from platform api message', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in delete permantly api is', e)
            }
        }
    }

    const hideFromPlatform = async (review) => {
        setLoading(true)
        // setShowPopup(false)
        const data = await AsyncStorage.getItem("USER")
        if (data) {
            let u = JSON.parse(data)
            let apidata = {
                reviewId: review.id
            }
            console.log('apidata', apidata)
            // return
            try {
                const response = await axios.post(Apipath.hideFromPlatform, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                        'Content-Type': 'application/json'
                    }
                })
                setLoading(false)
                if (response.data) {
                    if (response.data.status === true) {
                        console.log('delete account api data', response.data)
                        filteredReviews = reviews.filter(item => review.id !== item.id)
                        console.log('filteredReviews', filteredReviews)
                        setReviews(filteredReviews)

                    } else {
                        console.log('hide from platform message', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in delete permantly api is', e)
            }
        }
    }
    const suspendAccount = async () => {
        setLoading(true)
        // setShowPopup(false)
        const data = await AsyncStorage.getItem("USER")
        if (data) {
            let u = JSON.parse(data)
            let apidata = {
                userId: user.id
            }
            console.log('apidata', apidata)
            // return
            try {
                const response = await axios.post(Apipath.suspendAccount, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                        'Content-Type': 'application/json'
                    }
                })
                setLoading(false)
                if (response.data) {
                    if (response.data.status === true) {
                        console.log('delete account api data', response.data)
                        navigation.goBack()
                    } else {
                        console.log('delete account api message', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in delete permantly api is', e)
            }
        }
    }
    const deleteAccount = async () => {
        setLoading(true)
        // setShowPopup(false)
        const data = await AsyncStorage.getItem("USER")
        if (data) {
            let u = JSON.parse(data)
            let apidata = {
                userId: user.id
            }
            console.log('apidata', apidata)
            // return
            try {
                const response = await axios.post(Apipath.deleteAccout, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                        'Content-Type': 'application/json'
                    }
                })
                setLoading(false)
                if (response.data) {
                    if (response.data.status === true) {
                        console.log('delete account api data', response.data)
                        navigation.goBack()
                    } else {
                        console.log('delete account api message', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in delete permantly api is', e)
            }
        }
    }



    const deleteCustomerAccount = async () => {
        try {
            setLoading2(true)
            let data = await AsyncStorage.getItem("USER")

            if (data) {
                let u = JSON.parse(data)
                let path = Apipath.deleteAccount

                let apidata = {
                    userId: user.id
                }
                console.log('api data is', apidata)
                // return
                const response = await axios.post(path, apidata, {
                    headers: {
                        'Authorization': "Bearer " + u.token
                    }
                })

                if (response) {
                    setLoading2(false)
                    if (response.data.status === true) {
                        setShowConfirmationPopup(false);
                        setTimeout(() => {
                            AsyncStorage.removeItem("USER"); navigation.reset({
                                index: 0,
                                routes: [{ name: ScreenNames.LoginScreen }]
                            })
                        }, 300);
                        ShowMessage("Account delted successfully", 'green')

                    } else {
                        ShowMessage(response.data.message,)
                    }
                }
            }
        } catch (e) {
            setLoading2(false)
            console.log('error in delete account api is', e)
        }
    }



    async function createChat(user) {
        setLoading(true);

        try {
            console.log("trying to search customer");
            const data = await AsyncStorage.getItem("USER");
            if (data) {
                let u = JSON.parse(data);

                let path = Apipath.createChat;

                // setloading(true)
                const response = await axios.post(
                    path,
                    { chatUserId: user.id },
                    {
                        headers: {
                            Authorization: "Bearer " + u.token,
                        },
                    }
                );
                setLoading(false);
                if (response.data) {
                    // if(response.data.data.status === true ){}
                    console.log("create chat response is", response.data.chat);
                    navigation.push(ScreenNames.ChatScreen, {
                        chat: response.data.chat,
                    });
                }
            }
        } catch (e) {
            setLoading(false);
            console.log("error in search customers", e);
        } finally {
            setLoading(false);
        }
    }

    const shouldShowMessageIcon = (user) => {
        console.log('user', user)
        if (!(user.role === "customer" && role === "customer")) {
            return true
        }
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
            setImage(ImageUrl)
            setShowGalleryPopup(false)
            try {
                const formData = new FormData()
                setImageLoader(true)
                formData.append('media', {
                    name: 'image',
                    type: 'JPEG',
                    uri: ImageUrl
                })
                console.log(result.assets[0].uri);



                await updateProfile(formData)

                DeviceEventEmitter.emit("UpdateProfile", "UpdateProfile")
                setImageLoader(false)
            } catch (e) {
                console.log('e', e)
            }

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
            setImageLoader(true)

            try {
                const formData = new FormData()
                setImageLoader(true)
                formData.append('media', {
                    name: 'image',
                    type: 'JPEG',
                    uri: ImageUrl
                })
                console.log(result.assets[0].uri);



                await updateProfile(formData)

                DeviceEventEmitter.emit("UpdateProfile", "UpdateProfile")
                setImageLoader(false)
            } catch (e) {
                console.log('e', e)
            }
            setShowGalleryPopup(false)
            // generateThumbnail(ImageUrl)
            console.log(result.assets[0].uri);
        } else {
            // setPopup(false)
            // alert('You did not select any video.');
        }
    };

    function getImage() {

        console.log('user.profile_image', user.profile_image)

        if (image) {
            return image
        }
        if (user.profile_image) {
            return user.profile_image
        }
    }
    return (
        // <SafeAreaView style={GlobalStyles.container}>
        <View style={GlobalStyles.container}>
            {
                loading && (
                    <LoadingAnimation visible={loading} />
                )
            }
            <View style={{
                alignItems: 'center', paddingTop: 50 / 930 * screenHeight, backgroundColor: 'white',
            }}>

                {
                    user.from !== "tabbar" && (
                        <View style={GlobalStyles.completeProfileTopBar}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack()
                                }}
                            >
                                <Image source={require('../../assets/Images/backArrow.png')}
                                    style={GlobalStyles.image24}
                                />
                            </TouchableOpacity>

                            <Text style={GlobalStyles.text14}>
                                Profile Detail
                            </Text>
                            {

                                role === "admin" ? (

                                    <TouchableOpacity>
                                        <Image source={require('../../assets/Images/threeDotsImage.png')}
                                            style={GlobalStyles.image24}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <View></View>
                                )}
                        </View>
                    )
                }

                <ImageViewer
                    visible={showImage != null}
                    url={showImage}
                    close={() => setShowImage(null)}
                />


                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, marginTop: 20 / 930 * screenHeight }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' }}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'flex-start', marginTop: 20 / 930 * screenHeight, alignSelf: 'flex-start',
                            gap: 20 / 430 * screenWidth
                        }}>

                            <TouchableOpacity
                                onPress={() => {
                                    role === "customer" && user.from == "tabbar" && (
                                        setShowGalleryPopup(true)
                                    )
                                }}
                            >
                                {
                                    imageLoader ? (
                                        <ActivityIndicator size={"large"} color={Colors.orangeColor} />
                                    ) : (
                                        <Image source={image || user.profile_image ? { uri: image || user.profile_image } : placeholderImage}
                                            style={{
                                                height: 75 / 930 * screenHeight, width: 75 / 930 * screenHeight, resizeMode: 'cover',
                                                borderWidth: 2, borderColor: 'white', borderRadius: 40
                                            }}
                                        />
                                    )
                                }
                            </TouchableOpacity>




                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 / 930 * screenHeight, width: 210 / 430 * screenWidth }}>
                                <Text style={GlobalStyles.text17}>
                                    {user.name}
                                </Text>
                                {
                                    user.city && (
                                        <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                            {user.city ? user.city : null} {user.state ? `,${user.state}` : null}
                                        </Text>
                                    )
                                }


                                <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                    Yaper since {moment(user.createdAt).format("YYYY")}
                                </Text>

                            </View>
                            {
                                user.from === "tabbar" && (
                                    <View style={{ marginLeft: 0 / 430 * screenWidth, flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.push(ScreenNames.MessagesListScreen)
                                                }}
                                            >
                                                <Image
                                                    source={require("../../assets/Images/messageIcon.png")}
                                                    style={GlobalStyles.image24}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => {
                                                navigation.push(ScreenNames.MyWalletScreen)
                                            }}>
                                                <Image
                                                    source={require("../../assets/Images/walletIcon.png")}
                                                    style={GlobalStyles.image24}
                                                />
                                            </TouchableOpacity>


                                        </View>



                                        <TouchableOpacity style={{}}
                                            onPress={logoutUser}
                                        >
                                            <Text style={[GlobalStyles.BtnText, { color: 'red' }]}>
                                                Logout
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{}}
                                            onPress={() => {
                                                setShowConfirmationPopup(true)
                                            }}
                                        >
                                            <Image
                                                source={require("../../assets/Images/deleteIcon.png")}
                                                style={GlobalStyles.image24}
                                            />
                                        </TouchableOpacity>
                                        <ConfirmationPopup
                                            showConfirmationPopup={showConfirmationPopup}
                                            setShowConfirmationPopup={setShowConfirmationPopup}
                                            loading={loading2}
                                            onContinue={() => deleteCustomerAccount()}
                                        />
                                    </View>
                                )
                            }




                        </View>
                        {
                            shouldShowMessageIcon(user) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        createChat(user)
                                    }}
                                >
                                    <Image
                                        source={require("../../assets/Images/messageIcon.png")}
                                        style={GlobalStyles.image24}
                                    />
                                </TouchableOpacity>

                            )
                        }
                    </View>
                    {
                        user.role != "business" ? (

                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: screenWidth - 40,
                                borderWidth: 0, gap: 30 / 430 * screenWidth, alignSelf: 'center'
                            }}>
                                <View style={{ alignSelf: 'center', borderWidth: 0 }}>
                                    <HalfCircularProgress progress={user.yapScore3Digit || user.yapScore3Digit != "Invalid input" ? user.yapScore3Digit : 0} type={"Yap"} />
                                </View>
                            </View>
                        ) : (

                            <View
                                style={{
                                    width: screenWidth - 40,
                                    marginTop: (30 / 930) * screenHeight,
                                }}
                            >
                                <Text style={[GlobalStyles.text14, { color: "#00000080" }]}>
                                    Media
                                </Text>

                                {user.media?.length > 0 ? (
                                    user.media.map((item) => (
                                        <View
                                            key={item.id}
                                            style={{
                                                width: screenWidth - 40,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: (20 / 430) * screenWidth,
                                                marginTop: (20 / 930) * screenHeight,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setShowImage(item.thumb_url)
                                                }}
                                            >

                                                <Image
                                                    source={{ uri: item.thumb_url }}
                                                    style={{
                                                        height: (75 / 930) * screenHeight,
                                                        width: (73 / 430) * screenWidth,
                                                        resizeMode: "cover",
                                                        borderRadius: 10,
                                                    }}
                                                />
                                            </TouchableOpacity>

                                            <View
                                                style={{
                                                    width: (270 / 430) * screenWidth,
                                                    alignItems: "flex-start",
                                                    flexDirection: "column",
                                                    gap: 8,
                                                }}
                                            >
                                                {/* <Text
                                                      style={{
                                                        fontSize: 14,
                                                        fontFamily: CustomFonts.InterMedium,
                                                        color: Colors.lightBlack,
                                                        opacity: 0.7,
                                                      }}
                                                    >
                                                      {getMediaName(item.url)}
                                                    </Text> */}
                                                <Text
                                                    numberOfLines={2}
                                                    style={[
                                                        GlobalStyles.text17,
                                                        { width: (250 / 430) * screenWidth },
                                                    ]}
                                                >
                                                    {item.caption}
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={[GlobalStyles.text12, { marginTop: 10 }]}>
                                        No media
                                    </Text>
                                )}


                            </View>

                        )
                    }

                    <View style={{}}>
                        <View style={{
                            width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            marginBottom: 10 / 930 * screenHeight, marginTop: 20 / 930 * screenHeight,
                        }}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', gap: 30 / 430 * screenWidth,
                                // borderWidth: 1
                            }}>
                                {
                                    menues.map((item) => (
                                        <View key={item.id} style={{ flexDirection: 'column', }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setselectedMenu(item)
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 / 430 * screenWidth, paddingHorizontal: 15 }}>
                                                    <Text style={[GlobalStyles.text17, { color: selectedMenu === item.value ? "black" : "#00000080" }]}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            {
                                                selectedMenu.value === item.value && (
                                                    <View style={{ height: 2, backgroundColor: Colors.orangeColor, marginTop: 5, }}></View>
                                                )
                                            }
                                        </View>

                                    ))
                                }
                            </View>

                            {
                                user.from === "tabbar" && (
                                    <TouchableOpacity onPress={() => {
                                        navigation.push(ScreenNames.Feedback)
                                    }}>
                                        <Text style={[GlobalStyles.text14, { color: Colors.orangeColor, }]}>
                                            Feedback
                                        </Text>
                                    </TouchableOpacity>
                                )

                            }


                        </View>

                        <ProfileRecentReviews navigation={navigation} selectedMenu="active" reviews={reviews && reviews} role={role && role} from={user.from}
                            hideFromPlatform={hideFromPlatform} deletePermanently={deletePermanently} suspendAccount={suspendAccount} deleteAccount={deleteAccount}
                        />


                    </View>
                </View>
            </View>


            <Modal
                visible={showGalleryPopup}
                transparent={true}
                animationType='slide'
            >
                <GaleryCamPopup close={() => {
                    setShowGalleryPopup(false)

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
        // </SafeAreaView>
    )
}

export default CustomerProfileDetails