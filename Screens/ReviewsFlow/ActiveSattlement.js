import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import { ReviewTypes } from '../../res/ReviewsTypes'
import { Rating } from 'react-native-ratings'

const ActiveSattlement = ({ navigation, reviews, role }) => {

    const image1 = require('../../assets/Images/profileImage.png')
    const image2 = require('../../assets/Images/profileImage2.png')

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
        } else
            if ((item.reviewStatus !== ReviewTypes.Past && item.reviewStatus !== ReviewTypes.Resolved && item.reviewStatus !== ReviewTypes.ResolvedByAdmin) && ((role === "business" && item.newActivityByCustomer) || (role === "customer" && item.newActivityByBusiness))) {
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

    const selectSettleView = (item) => {
        if (item.reviewStatus === ReviewTypes.Resolved || item.reviewStatus === ReviewTypes.ResolvedByAdmin || item.reviewStatus === ReviewTypes.Past) {
          return (
            <View style={{
              width: 330 / 430 * screenWidth, height: 38 / 930 * screenHeight, flexDirection: 'row', gap: 5,
              paddingHorizontal: 10 / 430 * screenWidth, backgroundColor: '#00000007', alignItems: 'center',
              borderRadius: 11
            }}>
    
              <Text numberOfLines={2} style={[GlobalStyles.text17, { color: "black" }]}>
                Settlement Offer ${item.settlementOfferObject && item.settlementOfferObject.amount} was paid
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
                Settlement Offer ${item.settlementOfferObject && item.settlementOfferObject.amount}
              </Text>
            </View>
          )
        }
      }

    return (
        <View style={{ height: screenHeight * 0.62 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    reviews.length > 0 ? (
                        reviews && reviews.map((item) => (
                            <TouchableOpacity key={item.id}
                                onPress={() => {
                                    navigation.push(ScreenNames.ReviewDetailsScreen, {
                                        reviewDetails: {
                                            review: item,
                                            from: 'sattle',
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
                                                        <Image source={{ uri: item.thumbUrl }}
                                                            style={[GlobalStyles.image37, { borderWidth: 2, borderColor: 'white', borderRadius: 20 }]}
                                                        />
                                                    </View>
                                                    <Rating
                                                        type='custom'
                                                        style={{ alignSelf: 'flex-start' }}
                                                        ratingCount={5}
                                                        ratingBackgroundColor='#FFC10730'
                                                        tintColor='white'
                                                        ratingColor='#FFC107'
                                                        imageSize={25}
                                                        readonly={true}
                                                        startingValue={item.yapScore || 0}
                                                        fractions={0}
                                                        showRating={false}
                                                    // onFinishRating={ratingCompleted}

                                                    />
                                                </View>

                                                <View style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 8 }}>

                                                    {selectView(item)}

                                                    {
                                                        role === "admin" && (
                                                            <TouchableOpacity>
                                                                <Image source={require('../../assets/Images/threeDotsImage.png')}
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
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                        <Text style={{
                                                            width: 260 / 430 * screenWidth, fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                                                            //borderWidth:1
                                                        }}>
                                                            {item.service} (${item.amountOfTransaction})
                                                        </Text>

                                                    </View>

                                                    <Text style={GlobalStyles.text14}>
                                                        Transaction date: {item.dateOfTransaction.replace(/\s+/g, '')}
                                                    </Text>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                        {/* {
                                                                item.images.map((img) => (
                                                                    <Image key={img.id} source={img.url}
                                                                        style={{ height: 45 / 930 * screenHeight, width: 40 / 430 * screenWidth, borderRadius: 3 }}
                                                                    />
                                                                ))
                                                            } */}

                                                        <Image source={{ uri: item.mediaUrl }}
                                                            style={{ height: 45 / 930 * screenHeight, width: 40 / 430 * screenWidth, borderRadius: 3 }}
                                                        />
                                                    </View>

                                                    <Text style={[GlobalStyles.text17, { marginTop: 10 / 930 * screenHeight }]}>
                                                        {item.notesAboutCustomer}
                                                    </Text>
                                                    {
                                                        item.settlementOffer && (
                                                            selectSettleView(item)
                                                        )
                                                    }

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
                                                                        //     <TouchableOpacity style={{ marginTop: 50 / 930 * screenHeight }}
                                                                        //         onPress={() => {
                                                                        //             navigation.push(ScreenNames.YapSattelmentAmount, {
                                                                        //                 review: item
                                                                        //             })
                                                                        //         }}
                                                                        //     >
                                                                        //         <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                                                                        //             Create Settlement Offer
                                                                        //         </Text>
                                                                        //     </TouchableOpacity>
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
                                                                        item.reviewStatus === ReviewTypes.Active &&
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
                                <View style={[GlobalStyles.divider, { marginTop: 5 }]}></View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={[GlobalStyles.text14, { marginTop: 20 / 930 * screenHeight }]}>
                            No reviews
                        </Text>
                    )
                }
            </ScrollView>
        </View>
    )
}

export default ActiveSattlement