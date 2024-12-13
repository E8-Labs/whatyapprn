import { View, Text, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { Colors } from '../res/Colors'
import { CustomFonts } from '../assets/font/Fonts'
import { Image } from 'expo-image'
import React, { useState, useRef } from 'react'
import { screenWidth, screenHeight, placeholderImage } from '../res/Constants'
import { Rating } from 'react-native-ratings'
import { ScreenNames } from '../res/ScreenNames'
import MessagePopup from './MessagePopup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ReviewTypes } from '../res/ReviewsTypes'
import LoadingAnimation from './LoadingAnimation'
import axios from 'axios'
import { Apipath } from '../Api/Apipaths'
import formatAmount from '../res/FormateAmount'



const image1 = require('../assets/Images/profileImage.png')
const image2 = require('../assets/Images/profileImage2.png')
const pImage = require('../assets/Images/product.png')


const ProfileRecentReviews = ({ deletePermanently, hideFromPlatform, navigation, reviews, role,
    deleteAccount, suspendAccount,from
}) => {

    const [showPopup, setShowPopup] = useState(false)
    const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
    const [loading, setLoading] = useState(false)
    const [selectedReview, setSelectedReview] = useState(null)

    const animatedvalue = useRef(null)

    console.log('reviews on recent review screen are', reviews)

    const selectView = (item) => {
        console.log(`review id ${item.id} and status is ${item.reviewStatus}`)
        if (item.reviewStatus === ReviewTypes.Disputed) {
            return (
                <View style={{
                    paddingVertical: 5, backgroundColor: '#F4433610',
                    alignItems: 'center', flexDirection: 'row', gap: 5,
                    borderRadius: 20, paddingHorizontal: 20,
                }}>
                    <Image source={require('../assets/Images/disputeIcon.png')}
                        style={{ height: 16, width: 16 }}
                    />
                    <Text style={[GlobalStyles.text14, { color: '#F44336' }]}>
                        Dispute
                    </Text>
                </View>
            )
        } else
            if ((item.reviewStatus !== ReviewTypes.Past && item.reviewStatus !== ReviewTypes.Resolved && item.reviewStatus !== ReviewTypes.ResolvedByAdmin) && ((role === "business" && item.newActivityByCustomer) || (role === "customer" && item.newActivityByBusiness))) {
                console.log('needs action')
                return (
                    <View style={{
                        backgroundColor: '#FF570010', padding: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4
                    }}>
                        <Image source={require('../assets/Images/notIcon.png')}
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
                        <Image source={require('../assets/Images/greenTickIcon.png')}
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
                    <Image source={require('../assets/Images/dollarIcon.png')}
                        style={{ height: 16, width: 16 }}
                    />
                    <Text numberOfLines={2} style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>
                        Settlement Offer ${item.settlementOfferObject && formatAmount(item.settlementOfferObject.amount)}
                    </Text>
                </View>
            )
        }
    }

    const handleThreeDotsPress = (event, item) => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
            setPopupPosition({ top: pageY + height, right: screenWidth - pageX - width });
            setShowPopup(true);
            setSelectedReview(item)
        });
    };

    return (
        loading ? (
            <LoadingAnimation visible={loading} />
        ) :
            <View>

                <View style={{ height:from === "tabbar" ? screenHeight * 0.48: screenHeight* 0.5 ,}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            reviews.length > 0 ? (
                                <>
                                    <FlatList
                                        scrollEnabled={false}
                                        style= {{marginBottom:50}}
                                        showsVerticalScrollIndicator={false}
                                        data={reviews}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.push(ScreenNames.ReviewDetailsScreen, {
                                                        reviewDetails: {
                                                            review: item,
                                                            from: 'profile',
                                                        }
                                                    })
                                                }}
                                            >
                                                <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'column', }}>
                                                    {
                                                        // index === 0 ? (
                                                        <View style={{
                                                            marginTop: 40 / 930 * screenHeight, width: screenWidth - 40, alignItems: 'center', flexDirection: 'column',
                                                            // borderWidth: 1
                                                        }}>
                                                            <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                                                    <View style={{ borderWidth: 2, borderRadius: 20, borderColor: '#FF570020' }}>
                                                                        <Image source={item.business.profile_image ? { uri: item.business.profile_image } : placeholderImage}
                                                                            style={[GlobalStyles.image37, { borderWidth: 2, borderColor: 'white', borderRadius: 20 }]}
                                                                        />
                                                                    </View>
                                                                    <Text style={{
                                                                        fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                                                                        //borderWidth:1
                                                                    }}>
                                                                        {item.business.name}
                                                                    </Text>


                                                                </View>

                                                                <View style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 8 }}>

                                                                    {selectView(item)}

                                                                    {
                                                                        role === "admin" && (
                                                                            <TouchableOpacity
                                                                                onPress={(event) => handleThreeDotsPress(event, item)}
                                                                            >
                                                                                <Image source={require('../assets/Images/threeDotsImage.png')}
                                                                                    style={GlobalStyles.image24}
                                                                                />
                                                                            </TouchableOpacity>
                                                                        )
                                                                    }
                                                                </View>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', width: screenWidth - 40, alignSelf: 'center', marginTop: 15 / 930 * screenHeight }}>
                                                                <>
                                                                    <View style={{ height: 3, width: 3, borderRadius: 2, backgroundColor: '#B9B9B9', marginLeft: 18 / 430 * screenWidth }}></View>
                                                                    <View style={{ width: 1, backgroundColor: '#B9B9B9', marginLeft: -2 }}></View>
                                                                </>


                                                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10, marginLeft: 20, width: 330 / 430 * screenWidth }}>
                                                                    <Rating
                                                                        type='custom'
                                                                        style={{ alignSelf: 'flex-start' }}
                                                                        ratingCount={5}
                                                                        ratingBackgroundColor='#FFC10730'
                                                                        tintColor='#fff'
                                                                        ratingColor='#FFC107'
                                                                        imageSize={25}
                                                                        readonly={true}
                                                                        startingValue={item.yapScore || 0}
                                                                        fractions={0}
                                                                        showRating={false}
                                                                    // onFinishRating={ratingCompleted}

                                                                    />
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                                        <Text style={{
                                                                            width: 260 / 430 * screenWidth, fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                                                                            //borderWidth:1
                                                                        }}>
                                                                            {item.service} (${formatAmount(item.amountOfTransaction)})
                                                                        </Text>

                                                                    </View>

                                                                    <Text style={GlobalStyles.text14}>
                                                                        Transaction date: {item.dateOfTransaction.replace(/\s+/g, '')}
                                                                    </Text>

                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                                        {
                                                                            item.media.map((img) => (
                                                                                <Image key={img.id} source={{ uri: img.thumb_url }}
                                                                                    style={{ height: 45 / 930 * screenHeight, width: 40 / 430 * screenWidth, borderRadius: 3 }}
                                                                                />
                                                                            ))
                                                                        }

                                                                        {/* <Image source={{ uri: item.mediaUrl }}
                                                                style={{ height: 45 / 930 * screenHeight, width: 40 / 430 * screenWidth, borderRadius: 3 }}
                                                            /> */}
                                                                    </View>

                                                                    <Text style={[GlobalStyles.text17, { marginTop: 10 / 930 * screenHeight }]}>
                                                                        {item.notesAboutCustomer}
                                                                    </Text>
                                                                    {
                                                                        item.settlementOffer && (
                                                                            selectSettleView(item)
                                                                        )
                                                                    }
                                                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 17 / 430 * screenWidth, marginTop: 10 / 930 * screenHeight }}>

                                                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 15 }}>
                                                                            {/* <View style={{ borderWidth: 2, borderColor: '#FF570020', borderRadius: 20 }}> */}
                                                                            <Image source={item.customer.profile_image ? { uri: item.customer.profile_image } : placeholderImage}
                                                                                style={[GlobalStyles.image24, { borderRadius: 30, borderWidth: 2, borderColor: 'white' }]}
                                                                            />
                                                                            <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                                                                                {item.customer.name}
                                                                            </Text>
                                                                        </View>

                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>

                                                                            <View style={{
                                                                                paddingVertical: 5, borderRadius: 20, alignItems: 'center', flexDirection: 'row',
                                                                                backgroundColor: '#C0C0C020', paddingHorizontal: 8, gap: 8,
                                                                            }}>
                                                                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                                                    <Image source={require('../assets/Images/yIcon.png')}
                                                                                        style={GlobalStyles.yIcon}
                                                                                    />
                                                                                    <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                                                                                        ap score
                                                                                    </Text>
                                                                                </View>
                                                                                <Text style={{ fontSize: 14, fontFamily: CustomFonts.IntriaBold }}>
                                                                                    {item.customer.yapScore3Digit}
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{
                                                                        flexDirection: 'row', width: screenWidth - 100, alignItems: 'center', gap: 30 / 430 * screenWidth,
                                                                        marginBottom: 0 / 940 * screenHeight, justifyContent: 'flex-end',
                                                                    }}>

                                                                        <View style={{ width: 50 }}></View>

                                                                        {
                                                                            item.reviewStatus !== ReviewTypes.Disputed && (
                                                                                <>
                                                                                    {
                                                                                        // role === "business" ? (
                                                                                        //   <TouchableOpacity style={{ marginTop: 50 / 930 * screenHeight }}
                                                                                        //     onPress={() => {
                                                                                        //       navigation.push(ScreenNames.YapSattelmentAmount, {
                                                                                        //         review: item
                                                                                        //       })
                                                                                        //     }}
                                                                                        //   >
                                                                                        //     <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                                                        //       Create Settlement Offer
                                                                                        //     </Text>
                                                                                        //   </TouchableOpacity>
                                                                                        // ) : (
                                                                                        role === "customer" && item.reviewStatus !== ReviewTypes.Resolved && item.reviewStatus !== ReviewTypes.Active && item.reviewStatus !== ReviewTypes.ResolvedByAdmin && item.settlementOffer &&
                                                                                        <TouchableOpacity style={{ marginTop: 50 / 930 * screenHeight }}
                                                                                            onPress={() => {
                                                                                                navigation.push(ScreenNames.SettleReviewDetailsScreen, {
                                                                                                    review: item
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
                                                                                        item.reviewStatus === ReviewTypes.Active && role === "customer"  &&
                                                                                        <TouchableOpacity style={{ marginTop: 50 / 930 * screenHeight }}
                                                                                            onPress={() => {
                                                                                                navigation.push(ScreenNames.DisputeScreen, {
                                                                                                    review: item,
                                                                                                    from: 'Profile'
                                                                                                })
                                                                                            }}
                                                                                        >
                                                                                            <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                                                                Dispute
                                                                                            </Text>
                                                                                        </TouchableOpacity>

                                                                                    }
                                                                                </>
                                                                            )
                                                                        }



                                                                    </View>

                                                                </View>

                                                            </View>
                                                            <View style={{ height: 3, width: 3, borderRadius: 2, backgroundColor: '#B9B9B9', marginLeft: 18 / 430 * screenWidth, alignSelf: 'flex-start' }}></View>


                                                        </View>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </>
                            ) : (
                                <Text style={[GlobalStyles.text14, { alignSelf: 'center', marginTop: 20 }]}>
                                    No reviews
                                </Text>
                            )
                        }
                        {
                            role === "admin" && (
                                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>

                                    <TouchableOpacity style={GlobalStyles.capsuleBtn}
                                        onPress={() => {
                                            suspendAccount()
                                        }}
                                    >
                                        <Text style={GlobalStyles.BtnText}>
                                            Suspend Account
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
                            )
                        }
                    </ScrollView>

                </View>
                {/* {
                selectedMenue === "business" &&
                <TouchableOpacity style={[GlobalStyles.capsuleBtn, { marginTop: 0 }]}
                    onPress={() => {
                        setShowPopup(true)
                    }}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Send Message (1 credit)
                    </Text>
                </TouchableOpacity>

            } */}

                {/* message popup */}
                <Modal
                    visible={false}
                    transparent={true}
                    animationType='slide'
                >
                    <MessagePopup closeModal={() => {
                        setShowPopup(false)
                    }} />
                </Modal>

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
                                position: 'absolute', top: popupPosition.top, right: popupPosition.right, padding: 15, backgroundColor: 'white',
                                borderRadius: 5, shadowColor: 'gray', flexDirection: 'column', gap: 10,
                                shadowOffset: { height: 0, width: 4 }, shadowOpacity: 0.5
                            }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowPopup(false)
                                        hideFromPlatform(selectedReview)
                                    }}
                                >
                                    <Text style={[GlobalStyles.BtnText, { color: 'black' }]}>
                                        Hide from platform
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setShowPopup(false)
                                        deletePermanently(selectedReview)
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
    )
}

export default ProfileRecentReviews