import { View, Text, TouchableOpacity, SafeAreaView, Modal, ScrollView, TextInput } from 'react-native'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import React, { useEffect, useState } from 'react'
import { placeholderImage } from '../../res/Constants'
import { Image } from 'expo-image'
import AsyncStorage from '@react-native-async-storage/async-storage'

import LoadingAnimation from '../../components/LoadingAnimation'

import { screenWidth, screenHeight } from '../../res/Constants'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import ProfileRecentReviews from '../../components/ProfileRecentReviews'

const AdminBusinessProfileDetailsScreen = ({ navigation, route }) => {

    const user = route.params.user


    const [showPopup, setShowPopup] = useState(false)
    const [image, setImage] = useState('')
    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [email, setEmail] = useState("")
    const [employees, setEmployees] = useState("")
    const [aboutBusiness, setAboutBusiness] = useState("")
    const [media, setMedia] = useState([])
    const [industry, setIndustry] = useState("")
    const [role,setRole] = useState("")

    const [password, setPassword] = useState("")


    const [reviews, setReviews] = useState([])


    const [showpass, setShowpass] = useState(false)
    const [loading, setLoading] = useState(false)

    const [selectedMenu, setselectedMenu] = useState({

        id: 1,
        name: "Basic Info",
        // value: ReviewTypes.Active
    })

    const menues = [
        {
            id: 1,
            name: "Basic Info",
        },
        {
            id: 2,
            name: "Business Reviews",
        },
    ]

    useEffect(() => {
        let u = user
        const setValues = () => {
            console.log('user is', u)
            setCity(u.city)
            setState(u.state)
            setEmail(u.email)
            setPassword(u.password)
            setName(u.name)
            setImage(u.profile_image)
            setAboutBusiness(u.about_business)
            setMedia(u.media)
            setRole(u.role)
        }
        setValues()
    }, [route.params])


    useEffect(() => {
        if (selectedMenu.name === "Business Reviews") {
            getReviews()
        }
    }, [selectedMenu])

    const getReviews = async () => {
        try {
            setLoading(true)
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)
                let path = Apipath.getReviews + "?userId=" + user.id
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

    const suspendAccount = async () => {
        if(user.accountStatus === "suspended"){
            return
        }
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
        <SafeAreaView style={[GlobalStyles.container]}>
            {
                loading && (
                    <LoadingAnimation visible={loading} />
                )
            }
            <View style={[GlobalStyles.container]}>
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

                    <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                        Business Information
                    </Text>
                    <View></View>
                </View>
                <View style={{ height: screenHeight * 0.86, }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{}}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            width: screenWidth - 50, marginTop: 30 / 930 * screenHeight
                        }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                <Image source={image ? { uri: image } : placeholderImage}
                                    style={{
                                        height: 88 / 930 * screenHeight,
                                        width: 88 / 430 * screenWidth,
                                        resizeMode: 'cover',
                                        borderRadius: 50
                                    }}
                                />
                                <View style={{ flexDirection: 'column', gap: 10 / 930 * screenHeight }}>
                                    <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                                        {user && user.name}
                                    </Text>
                                    <Text style={GlobalStyles.text12}>
                                        {city}{state ? `, ${state}` : ""}
                                    </Text>
                                    <Text style={GlobalStyles.text12}>
                                        {email}
                                    </Text>
                                </View>
                            </View>


                        </View>

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
                                                <Text style={[GlobalStyles.text17, { color: selectedMenu.name === item.name ? "black" : "#00000080" }]}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            selectedMenu.name === item.name && (
                                                <View style={{ height: 2, backgroundColor: Colors.orangeColor, marginTop: 5, }}></View>
                                            )
                                        }
                                    </View>

                                ))
                            }
                        </View>
                        {
                            selectedMenu.name === "Basic Info" ? (
                                <>
                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight,
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                            Media
                                        </Text>
                                    </View>

                                    {
                                        user.media ? user.media.map((item) => (
                                            <View key={item.id} style={{
                                                width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', gap: 20 / 430 * screenWidth,
                                                marginTop: 20 / 930 * screenHeight
                                            }}>
                                                <Image source={item.type === 'image' ? item.url : item.thumb_url}
                                                    style={{
                                                        height: 75 / 930 * screenHeight, width: 73 / 430 * screenWidth, resizeMode: 'cover',
                                                        borderRadius: 10
                                                    }}
                                                />

                                                <View style={{ width: 270 / 430 * screenWidth, alignItems: 'flex-start', flexDirection: 'column', gap: 8 }}>
                                                    <Text style={{
                                                        fontSize: 14, fontFamily: CustomFonts.InterMedium, color: Colors.lightBlack,
                                                        opacity: 0.7
                                                    }}>
                                                        {item.name}
                                                    </Text>
                                                    <Text numberOfLines={2} style={[GlobalStyles.text17, { width: 250 / 430 * screenWidth }]}>
                                                        {item.caption}
                                                    </Text>
                                                </View>

                                            </View>
                                        )) : (
                                            <Text style={[GlobalStyles.text12, { marginTop: 10 }]}>
                                                No media
                                            </Text>
                                        )
                                    }


                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight,
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                            Industry
                                        </Text>


                                    </View>

                                    <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start', marginTop: 15 / 930 * screenHeight }]}>
                                        {user.business_industry}
                                    </Text>


                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight,
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                            Number of Employee
                                        </Text>
                                    </View>


                                    <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start', marginTop: 15 / 930 * screenHeight }]}>
                                        {user.business_employees}
                                    </Text>



                                    <View style={{
                                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight,
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={[GlobalStyles.text14, { color: '#00000080' }]}>
                                            About Business
                                        </Text>


                                    </View>

                                    <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start', marginTop: 15 / 930 * screenHeight, width: screenWidth - 60 }]}>
                                        {user.about_business}
                                    </Text>

                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>

                                        <TouchableOpacity style={GlobalStyles.capsuleBtn}
                                            onPress={() => {
                                                suspendAccount()
                                            }}
                                        >
                                            <Text style={GlobalStyles.BtnText}>
                                               {user.accountStatus === "suspended"?"Suspended":"Suspend Account"} 
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[GlobalStyles.capsuleBtn, { backgroundColor: 'white' }]}
                                            onPress={() => {
                                                deleteAccount()
                                            }}
                                        >
                                            <Text style={[GlobalStyles.BtnText, { color: "red" }]}>
                                                Delete Account
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ):(
                                <ProfileRecentReviews navigation={navigation} reviews={reviews} role={role} />
                            )
                        }

                    </ScrollView>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default AdminBusinessProfileDetailsScreen