import { View, Text, Image, TouchableOpacity, SafeAreaView, FlatList, Modal } from 'react-native'
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
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'

const CustomerProfileDetails = ({ navigation, route }) => {

    const [role, setRole] = useState("")
    const [selectedMenu, setselectedMenu] = useState({

        id: 1,
        name: "Active",
        value: ReviewTypes.Active
    })
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
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


    let user = route.params.user

    // let user = role && role === "business" ? usr.viewed : usr
    console.log('user on prfile datails screen ', user)

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


                <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40, marginTop: 20 / 930 * screenHeight }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' }}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'flex-start', marginTop: 20 / 930 * screenHeight, alignSelf: 'flex-start',
                            gap: 20 / 430 * screenWidth
                        }}>
                            <Image source={user.profile_image ? { uri: user.profile_image } : placeholderImage}
                                style={{
                                    height: 75 / 930 * screenHeight, width: 75 / 930 * screenHeight, resizeMode: 'cover',
                                    borderWidth: 2, borderColor: 'white', borderRadius: 40
                                }}
                            />

                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 / 930 * screenHeight }}>
                                <Text style={GlobalStyles.text17}>
                                    {user.name}
                                </Text>
                                {
                                    user.city && (
                                        <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                            {user.city ? user.city : null} {user.state ? ` ,${user.state}` : null}
                                        </Text>
                                    )
                                }


                                <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                    Yaper since {moment(user.createdAt).format("YYYY")}
                                </Text>

                            </View>
                            {
                                user.from === "tabbar" && (
                                    <View style={{marginLeft: 80 / 430 * screenWidth , flexDirection: 'column', gap: 10, alignItems: 'center'}}>
                                        <View style = {{flexDirection:'row',alignItems:'center',gap:15}}>
                                            <TouchableOpacity
                                                onPress={()=>{
                                                    navigation.push(ScreenNames.MessagesListScreen)
                                                }}
                                            >
                                                <Image
                                                    source={require("../../assets/Images/messageIcon.png")}
                                                    style={GlobalStyles.image24}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{
                                                    navigation.push(ScreenNames.MyWalletScreen)
                                                }}>
                                                <Image
                                                    source={require("../../assets/Images/walletIcon.png")}
                                                    style={GlobalStyles.image24}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity style={{ }}
                                            onPress={logoutUser}
                                        >
                                            <Text style={[GlobalStyles.BtnText, { color: 'red' }]}>
                                                Logout
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}


                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: screenWidth - 40,
                        borderWidth: 0, gap: 30 / 430 * screenWidth, alignSelf: 'center'
                    }}>
                        <View style={{ alignSelf: 'center', borderWidth: 0 }}>
                            <HalfCircularProgress progress={user.yapScore3Digit||user.yapScore3Digit != "Invalid input"  ?  user.yapScore3Digit : 0} type={"Yap"} />
                        </View>
                    </View>

                    <View style={{ }}>
                        {
                            // user.from !== 'tabbar' ?
                            //     (
                            //         <>
                            //             <View style={{
                            //                 width: screenWidth - 80, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 0 / 930 * screenHeight, marginBottom: 20 / 930 * screenWidth,

                            //             }}>
                            //                 <Text style={GlobalStyles.text17}>
                            //                     Recent Reviews
                            //                 </Text>



                            //                 <TouchableOpacity>
                            //                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            //                         <Text style={GlobalStyles.text17}>
                            //                             Filter
                            //                         </Text>
                            //                         <Image source={require('../../assets/Images/filterIcon2.png')}
                            //                             style={{ height: 16, width: 16 }}
                            //                         />
                            //                     </View>
                            //                 </TouchableOpacity>
                            //             </View>
                            //             <ProfileRecentReviews navigation={navigation} selectedMenu="business" reviews={reviews && reviews} />
                            //         </>
                            //     ) : (
                            <>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: screenWidth - 80, gap: 30 / 430 * screenWidth,
                                    marginTop: 20 / 930 * screenHeight, marginBottom: 10 / 930 * screenHeight
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
                                <ProfileRecentReviews navigation={navigation} selectedMenu="active" reviews={reviews && reviews} role={role && role} from = {user.from}
                                    hideFromPlatform={hideFromPlatform} deletePermanently={deletePermanently} suspendAccount={suspendAccount} deleteAccount={deleteAccount}
                                />

                            </>
                            //         )
                        }
                    </View>
                </View>
            </View>




        </View>
        // </SafeAreaView>
    )
}

export default CustomerProfileDetails