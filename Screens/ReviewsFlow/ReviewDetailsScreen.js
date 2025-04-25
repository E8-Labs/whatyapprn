import { View, Text, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Rating } from 'react-native-ratings'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import { useFocusEffect } from '@react-navigation/native'
import { ReviewTypes } from '../../res/ReviewsTypes'
import LoadingAnimation from '../../components/LoadingAnimation'
import calculateSpent from '../../res/CalculateSpent'
import formatAmount from '../../res/FormateAmount'
import { ImageViewer } from '../../components/ImageViewer'

const image1 = require('../../assets/Images/profileImage.png')
const image2 = require('../../assets/Images/profileImage2.png')
const pImage = require('../../assets/Images/product.png')

const ReviewDetailsScreen = ({ navigation, route }) => {

    const [messages, setMessages] = useState([])
    const [role, setRole] = useState(false)
    const [updatedData, setUpdatedData] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [loading, setLoading] = useState(false)

    const [openImage, setOpenImage] = useState(null)

    const reviewdetails = route.params.reviewDetails
    console.log('review details are', reviewdetails.review)

    let review = reviewdetails.review

    useFocusEffect(
        useCallback(() => {
            loadMessages()
        }, [])
    )

    const selectView = (item) => {
        console.log(`review id ${item.id} and status is ${item.reviewStatus}`)
        if (item.reviewStatus === ReviewTypes.Disputed) {
            return (
                <View style={{
                    paddingVertical: 5, backgroundColor: '#F4433610',
                    alignItems: 'center', flexDirection: 'row', gap: 5,
                    borderRadius: 20, paddingHorizontal: 20,
                }}>
                    <Image source={require('../../assets/Images/disputeIcon.png')}
                        style={{ height: 16, width: 16 }}
                    />
                    <Text style={[GlobalStyles.text14, { color: '#F44336' }]}>
                        Dispute
                    </Text>
                </View>
            )
        } else if ((item.reviewStatus !== ReviewTypes.Past && item.reviewStatus !== ReviewTypes.Resolved && item.reviewStatus !== ReviewTypes.ResolvedByAdmin) && ((role === "business" && item.newActivityByCustomer) || (role === "customer" && item.newActivityByBusiness))) {
            console.log('needs action')
            return (
                <View style={{
                    backgroundColor: '#FF570010', padding: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4
                }}>
                    <Image source={require('../../assets/Images/notIcon.png')}
                        style={{ height: 16, width: 16 }}
                    />
                    <Text style={{ fontSize: 12, fontFamily: CustomFonts.InterMedium, color: Colors.orangeColor }}>
                        Needs review
                    </Text>
                </View>
            )
        } else if (item.reviewStatus === ReviewTypes.Resolved || item.reviewStatus === ReviewTypes.Past || item.reviewStatus === ReviewTypes.ResolvedByAdmin) {
            console.log('resolved')
            return (
                <View style={{
                    backgroundColor: Colors.greenColor10, padding: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4
                }}>
                    <Image source={require('../../assets/Images/greenTickIcon.png')}
                        style={{ height: 16, width: 16 }}
                    />
                    <Text style={{ fontSize: 12, fontFamily: CustomFonts.InterMedium, color: Colors.greenColor }}>
                        Resolved
                    </Text>
                </View>
            )
        }

        else {
            console.log("#######################################################")
            console.log(`noting for ${item.service} | st: ${item.reviewStatus} Cust: ${item.newActivityByCustomer} Bus: ${item.newActivityByBusiness} role: ${role}`);
            // console.log(`noting for2 ${item.service} | st: ${item.reviewStatus} Cust: ${newActivityByCustomer} Bus: ${newActivityByBusiness}`);
            // console.log("#######################################################")
        }
    }


    const loadMessages = async () => {
        try {
            const data = await AsyncStorage.getItem("USER")
            if (data) {
                let u = JSON.parse(data)
                console.log('user token is', u.user.role)
                setRole(u.user.role)
                let path = Apipath.loadMessages + "?reviewId=" + review.id
                console.log('path is', path)
                const response = await axios.get(path, {
                    headers: {
                        'Authorization': "Bearer " + u.token
                    }
                })

                // console.log('response is', response)

                if (response.data) {
                    if (response.data.status === true) {
                        console.log('loaded messages are', response.data.data)
                        setMessages(response.data.data)

                    } else {
                        console.log('load messages api message is', response.data.message)
                    }
                }
            }
        } catch (e) {
            console.log('error in load messages api is ', e)
        }
    }

    const getHeading = () => {
        if (reviewdetails.from === "sattle") {
            return "Settle"
        } else {
            return "Review Details"
        }
    }


    const selectSettleView = (item) => {
        if (item.reviewStatus === ReviewTypes.Resolved || item.reviewStatus === ReviewTypes.ResolvedByAdmin || item.reviewStatus === ReviewTypes.Past) {
            return (
                <View style={{
                    width: 330 / 430 * screenWidth, height: 38 / 930 * screenHeight, flexDirection: 'row', gap: 5,
                    paddingHorizontal: 10 / 430 * screenWidth, backgroundColor: '#00000007', alignItems: 'center',
                    borderRadius: 11
                }}>

                    <Text numberOfLines={2} style={[GlobalStyles.text17, { color: "black" }]}>
                        Settlement Offer ${item.settlementOfferObject && formatAmount(item.settlementOfferObject.amount)} was paid
                    </Text>
                </View>
            )

        } else {
            return (
                <View style={{
                    width: 330 / 430 * screenWidth, height: 38 / 930 * screenHeight, flexDirection: 'row', gap: 5,
                    paddingHorizontal: 10 / 430 * screenWidth, backgroundColor: '#FF570010', alignItems: 'center',
                    borderRadius: 11
                }}>
                    <Image source={require('../../assets/Images/dollarIcon.png')}
                        style={{ height: 16, width: 16 }}
                    />
                    <Text numberOfLines={2} style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>
                        Settlement Offer ${item.settlementOfferObject && formatAmount(item.settlementOfferObject.amount)}
                    </Text>
                </View>
            )
        }
    }

    const updateView = (data) => {
        console.log('data from dispute screen is', data)
        review.reviewStatus = "disputed"
        setUpdatedData(data)
        selectView(data)
    }

    const hideFromPlatform = async () => {
        setLoading(true)
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
                        console.log('hide from platform data', response.data)
                        navigation.goBack()
                    } else {
                        console.log('hide from platform message', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in delete permantly api is', e)
            }
        }
    }

    const deletePermanently = async () => {
        setLoading(true)
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
                        console.log('hide from platform data', response.data.data)
                        navigation.goBack()
                    } else {
                        console.log('hide from platform message', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in delete permantly api is', e)
            }
        }
    }

    const resolveOrRejectReview = async (resolve) => {
        const data = await AsyncStorage.getItem("USER")
        if (data) {
            try {
                setLoading(true)
                let u = JSON.parse(data)
                let apidata = {
                    reviewId: review.id,
                    resolve: resolve
                }
                console.log('apidata', apidata)
                // return
                const response = await axios.post(Apipath.resolveOrReject, apidata, {
                    headers: {
                        'Authorization': 'Bearer ' + u.token,
                        'Content-Type': "application/json"
                    }
                })

                if (response.data) {
                    setLoading(false)
                    if (response.data.status === true) {
                        console.log('review resolved or rejected', response.data.message)
                        navigation.goBack()
                    } else {
                        console.log('review resolved message is', response.data.message)
                    }
                }
            } catch (e) {
                console.log('error in resolve or reject api is', e)
            }
        }
    }


    return (
        loading ? (
            <LoadingAnimation visible={loading} />
        ) :
            <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#f2f2f2' }]}>
                <View style={[GlobalStyles.container, { backgroundColor: '#f2f2f2' }]}>
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
                            {getHeading()}
                        </Text>
                        {
                            role === "admin" ? (

                                <TouchableOpacity

                                >
                                    <Image source={require('../../assets/Images/threeDotsImage.png')}
                                        style={GlobalStyles.image24}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <View></View>
                            )}
                    </View>
                    <View style={{ height: screenHeight * 0.87, borderWidth: 0 }}>

                        <View style={{}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'column', }}>
                                    {/* {
                                    index === 0 ? ( */}


                                    <View style={{
                                        marginTop: 40 / 930 * screenHeight, width: screenWidth - 40, alignItems: 'center', flexDirection: 'column',
                                        // borderWidth: 1
                                    }}>
                                        <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                                {/* <View style={{ borderWidth: 2, borderRadius: 20, borderColor: '#FF570020' }}> */}
                                                <Image source={review.business.profile_image ? { uri: review.business.profile_image } : placeholderImage}
                                                    style={[GlobalStyles.image37,]}
                                                />

                                                {/* </View> */}
                                                <Text style={{
                                                    fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                                                    //borderWidth:1
                                                }}>
                                                    {review.business.name}
                                                </Text>

                                            </View>

                                            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 8 }}>

                                                {selectView(review)}
                                                {
                                                    role === 'admin' && (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                console.log('show popop')
                                                                setShowPopup(true)
                                                            }}>
                                                            <Image source={require('../../assets/Images/threeDotsImage.png')}
                                                                style={GlobalStyles.image24}
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', width: screenWidth - 40, alignSelf: 'center', marginTop: 15 / 930 * screenHeight }}>
                                            {/* top dot */}
                                            {/* {
                                                    index === 0 && ( */}
                                            <>
                                                <View style={{ height: 3, width: 3, borderRadius: 2, backgroundColor: '#B9B9B9', marginLeft: 18 / 430 * screenWidth }}></View>
                                                <View style={{ width: 1, backgroundColor: '#B9B9B9', marginLeft: -2 }}></View>
                                            </>
                                            {/* )
                                                } */}

                                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginLeft: 20, width: 330 / 430 * screenWidth }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Text style={{
                                                        width: 260 / 430 * screenWidth, fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                                                    }}>
                                                        {review.service} (${formatAmount(review.amountOfTransaction)})
                                                    </Text>

                                                </View>

                                                <Text style={[GlobalStyles.text14, { color: '#00000090' }]}>
                                                    Transaction date: {review.dateOfTransaction.replace(/\s+/g, '')}
                                                </Text>

                                                {
                                                    review.media?.length > 0 && (
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                            {
                                                                review.media.map((img) => (
                                                                    <TouchableOpacity onPress={() => {
                                                                        setOpenImage(img.thumb_url)
                                                                    }}>
                                                                        <Image source={{ uri: img.thumb_url }}
                                                                            style={{ height: 45 / 930 * screenHeight, width: 45 / 930 * screenHeight, borderRadius: 5, resizeMode: 'cover' }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                ))
                                                            }
                                                        </View>
                                                    )
                                                }

                                                <ImageViewer visible={openImage != null} close={() => setOpenImage(null)} url={openImage} />

                                                <Text style={[GlobalStyles.text17, { marginTop: 10 / 930 * screenHeight }]}>
                                                    {review.notesAboutCustomer}
                                                </Text>
                                                {
                                                    review.settlementOffer && (
                                                        selectSettleView(review)
                                                    )
                                                }


                                            </View>
                                        </View>

                                    </View>
                                    {/* ) : ( */}

                                    <FlatList
                                        data={messages}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (

                                            <View style={{ flexDirection: 'row', width: screenWidth - 40, }}>
                                                <View style={{ width: 1, backgroundColor: '#B9B9B9', marginLeft: 19 / 430 * screenWidth }}></View>
                                                {/* {index === data.length - 1 && ( */}
                                                {/* <View style={{ height: 3, width: 3, backgroundColor: 'gray', marginTop: 20, alignSelf: 'flex-end', marginLeft: -2, borderRadius: 2 }} /> */}
                                                {/* )} */}
                                                <View style={{ width: 338 / 430 * screenWidth, flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginLeft: 25 / 430 * screenWidth }}>

                                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 17 / 430 * screenWidth, marginTop: 20 / 930 * screenHeight }}>

                                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 15 }}>
                                                            {/* <View style={{ borderWidth: 2, borderColor: '#FF570020', borderRadius: 20 }}> */}
                                                            <Image source={item.user.profile_image ? { uri: item.user.profile_image } : placeholderImage}
                                                                style={[GlobalStyles.image24, { borderRadius: 30, borderWidth: 2, borderColor: 'white' }]}
                                                            />
                                                            {/* </View> */}
                                                            <View style={{ flexDirection: 'column', gap: 5 }}>
                                                                <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                                                                    {item.user.name}
                                                                </Text>
                                                                {/* <Text style={[GlobalStyles.text14, { color: Colors.orangeColor }]}>
                                                                    {item.role === "customer" ? "Cusotmer" : "Business"} Response
                                                                </Text> */}
                                                            </View>

                                                        </View>
                                                        <Text style={[GlobalStyles.text17, {}]}>
                                                            {item.message}
                                                        </Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                                            {

                                                                item.user.role != "business" && (
                                                                    <View style={{
                                                                        paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
                                                                        backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
                                                                    }}>
                                                                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                                            <Image source={require('../../assets/Images/yIcon.png')}
                                                                                style={GlobalStyles.yIcon}
                                                                            />
                                                                            <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                                                                                ap score
                                                                            </Text>
                                                                        </View>
                                                                        <Text style={{ fontSize: 14, fontFamily: CustomFonts.IntriaBold }}>
                                                                            {item.user.yapScore3Digit}
                                                                        </Text>
                                                                    </View>
                                                                )}

                                                            {

                                                                item.user.role != "business" && (
                                                                    <View style={{
                                                                        paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
                                                                        backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
                                                                    }}>
                                                                        <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                                                                            Spent over {calculateSpent(item.user.totalSpent)}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )}

                                    />
                                    <View style={{
                                        height: 3, width: 3, borderRadius: 2, backgroundColor: '#B9B9B9', marginLeft: 18 / 430 * screenWidth,
                                        alignSelf: 'flex-start'
                                    }}></View>

                                    {
                                        role === 'admin' && !(
                                            review.reviewStatus === ReviewTypes.RejectedByAdmin || review.reviewStatus === ReviewTypes.Resolved || review.reviewStatus === ReviewTypes.Rejected
                                            || review.reviewStatus === ReviewTypes.ResolvedByAdmin
                                        ) ? (
                                            <View style={{
                                                borderWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: screenWidth - 50,
                                                marginTop: 20
                                            }}>
                                                <View style={{ width: 50 }}></View>
                                                <TouchableOpacity style={{ marginTop: 20 / 930 * screenHeight, alignSelf: 'flex-end' }}
                                                    onPress={() => resolveOrRejectReview(true)}
                                                >
                                                    <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                        Resolve
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ marginTop: 20 / 930 * screenHeight, alignSelf: 'flex-end' }}
                                                    onPress={() => resolveOrRejectReview(false)}

                                                >
                                                    <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                        Reject
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            role !== 'admin' &&
                                            <View style={{
                                                borderWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: screenWidth - 50,
                                                marginTop: 20
                                            }}>
                                                <View style={{ width: 100 }}></View>

                                                {review.reviewStatus !== ReviewTypes.Disputed && (
                                                    <>
                                                        {

                                                            role === "customer" && review.reviewStatus !== ReviewTypes.Resolved && review.reviewStatus !== ReviewTypes.ResolvedByAdmin && review.reviewStatus !== ReviewTypes.Resolved && review.settlementOffer &&
                                                            <TouchableOpacity style={{ marginTop: 0 / 930 * screenHeight }}
                                                                onPress={() => {
                                                                    navigation.push(ScreenNames.SettleReviewDetailsScreen, {
                                                                        review: review
                                                                    })
                                                                }}
                                                            >
                                                                <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                                    Settle
                                                                </Text>
                                                            </TouchableOpacity>

                                                            // )
                                                        }

                                                        {
                                                            review.reviewStatus === ReviewTypes.Active && role === "customer" && review.yapScore <= 3 &&
                                                            <TouchableOpacity style={{ marginTop: 0 / 930 * screenHeight }}
                                                                onPress={() => {
                                                                    navigation.push(ScreenNames.DisputeScreen, {
                                                                        review: review,
                                                                        updatedView: updateView
                                                                        // from:'sattle'
                                                                    })
                                                                }}
                                                            >
                                                                <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                                    Dispute
                                                                </Text>
                                                            </TouchableOpacity>

                                                        }
                                                        {
                                                            role && !(role === "business" && review.yapScore >= 3) && review.reviewStatus !== ReviewTypes.Resolved && review.reviewStatus !== ReviewTypes.RejectedByAdmin && (
                                                                <TouchableOpacity style={{ marginTop: 0 / 930 * screenHeight }}
                                                                    onPress={() => {
                                                                        navigation.push(ScreenNames.ReviewReplyScreen, {
                                                                            review: review,
                                                                            role: role
                                                                        })
                                                                    }}
                                                                >
                                                                    <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                                        Reply
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            )
                                                        }
                                                    </>
                                                )
                                                }

                                            </View>
                                        )
                                    }
                                </View>
                                {
                                    role === "admin" && (
                                        <View style={{ marginTop: 50 / 930 * screenHeight }}>
                                            <Text style={[GlobalStyles.text14, { color: '#00000050' }]}>Active Parties</Text>

                                            <TouchableOpacity>
                                                <View style={{
                                                    width: screenWidth - 40, backgroundColor: '#fff', borderRadius: 3,
                                                    marginTop: 30 / 930 * screenHeight, alignItems: "center", paddingVertical: 10, paddingHorizontal: 10
                                                }}>

                                                    <View style={{ width: screenWidth - 60, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <View style={{ flexDirection: 'column', gap: 10 }}>
                                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                                                <Image source={review.business.profile_image ? { uri: review.business.profile_image } : placeholderImage}
                                                                    style={[GlobalStyles.image24, { borderRadius: 20 }]}
                                                                />
                                                                <Text style={GlobalStyles.text17} > {review.business.name}</Text>
                                                                <Text style={[GlobalStyles.text12, { color: Colors.orangeColor }]} > Company</Text>
                                                            </View>
                                                            <Text style={GlobalStyles.text12} > {review.business.city} {review.business.state}</Text>
                                                            <View style={{ flexDirection: 'row', gap: 0, alignItems: 'center' }}>
                                                                <Image source={require('../../assets/Images/starIcon.png')}
                                                                    style={{ height: 14, width: 14, tintColor: '#FFC107' }}
                                                                />

                                                                <Text style={GlobalStyles.text12} > {review.business.totalReviews} reviews</Text>

                                                            </View>
                                                        </View>
                                                        <Image source={require('../../assets/Images/farwordArrow.png')}
                                                            style={GlobalStyles.image24}
                                                        />
                                                    </View>
                                                </View>

                                            </TouchableOpacity>

                                            <TouchableOpacity>
                                                <View style={{
                                                    width: screenWidth - 40, backgroundColor: '#fff', borderRadius: 3,
                                                    marginTop: 30 / 930 * screenHeight, alignItems: "center", paddingVertical: 10, paddingHorizontal: 10
                                                }}>

                                                    <View style={{ width: screenWidth - 60, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <View style={{ flexDirection: 'column', gap: 6 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                                                                    <Image source={review.customer.profile_image ? { uri: review.customer.profile_image } : placeholderImage}
                                                                        style={[GlobalStyles.image24, { borderRadius: 20 }]}
                                                                    />
                                                                    <Text style={GlobalStyles.text14} > {review.customer.name}</Text>
                                                                    <Text style={[GlobalStyles.text12, { color: Colors.orangeColor }]} > Customer</Text>
                                                                </View>
                                                                <View style={{
                                                                    paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
                                                                    backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
                                                                }}>
                                                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                                        <Image source={require('../../assets/Images/yIcon.png')}
                                                                            style={GlobalStyles.yIcon}
                                                                        />
                                                                        <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                                                                            ap score {review.customer.yapScore3Digit}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <Text style={GlobalStyles.text12} > {review.business.city} {review.business.state}</Text>
                                                            <View style={{ flexDirection: 'row', gap: 0, alignItems: 'center' }}>
                                                                <Image source={require('../../assets/Images/starIcon.png')}
                                                                    style={{ height: 14, width: 14, tintColor: '#FFC107' }}
                                                                />

                                                                <Text style={GlobalStyles.text12} > {review.customer.totalReviews} reviews</Text>

                                                            </View>
                                                        </View>
                                                        <Image source={require('../../assets/Images/farwordArrow.png')}
                                                            style={GlobalStyles.image24}
                                                        />
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                            </ScrollView>
                        </View>
                    </View>

                    <Modal
                        visible={showPopup}
                        transparent={true}
                        animationType='fade'
                    >
                        <TouchableWithoutFeedback style={{ height: screenHeight }} onPress={() => {
                            console.log('pressed')
                            setShowPopup(false)
                        }}>
                            <View style={{ height: screenHeight, width: screenWidth }} >
                                <View style={{
                                    padding: 15, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {
                                        height: 0, width: 4,
                                    }, position: 'absolute', top: 170 / 930 * screenHeight, right: 20,
                                    flexDirection: 'column', gap: 15, borderRadius: 5
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            hideFromPlatform()
                                        }}
                                    >
                                        <Text style={[GlobalStyles.BtnText, { color: 'black' }]}>
                                            Hide from platform
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            deletePermanently()
                                        }}
                                    >
                                        <Text style={[GlobalStyles.BtnText, { color: '#FF1504' }]}>
                                            Delete permanently
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

export default ReviewDetailsScreen