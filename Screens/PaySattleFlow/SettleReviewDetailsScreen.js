import { View, Text, Image, TouchableOpacity, } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { Colors } from '../../res/Colors'
import { Rating } from 'react-native-ratings'
import { CustomFonts } from '../../assets/font/Fonts'
import { ScreenNames } from '../../res/ScreenNames'


const SettleReviewDetailsScreen = ({ navigation, route }) => {

    const item = route.params.review
    console.log('item is', item)

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View>
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
                        Review
                    </Text>

                    <TouchableOpacity>
                        <Image source={require('../../assets/Images/threeDotsImage.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'column', height: screenHeight * 0.7,}}>
                    {/* { */}
                    <View style={{
                        marginTop: 40 / 930 * screenHeight, width: screenWidth - 40, alignItems: 'center', flexDirection: 'column',
                        // borderWidth: 1
                    }}>
                        <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                                <View style={{ borderWidth: 2, borderRadius: 20, borderColor: '#FF570020' }}>
                                    <Image source={item.thumbUrl ? { uri: item.thumbUrl } : placeholderImage}
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
                                    startingValue={item.productRating}
                                    fractions={0}
                                    showRating={false}
                                // onFinishRating={ratingCompleted}

                                />
                            </View>

                            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: 8 }}>

                                <TouchableOpacity>
                                    <Image source={require('../../assets/Images/threeDotsImage.png')}
                                        style={GlobalStyles.image24}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', width: screenWidth - 40, alignSelf: 'center', marginTop: 15 / 930 * screenHeight, }}>



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
                                    <Image source={{ uri: item.mediaUrl }}
                                        style={{ height: 45 / 930 * screenHeight, width: 40 / 430 * screenWidth, borderRadius: 3 }}
                                    />
                                </View>

                                <Text style={[GlobalStyles.text17, { marginTop: 10 / 930 * screenHeight }]}>
                                    {item.notesAboutCustomer}
                                </Text>
                                {
                                    item.settlementOffer && (
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

                            </View>
                        </View>
                        <View style={{ height: 3, width: 3, borderRadius: 2, backgroundColor: '#B9B9B9', marginLeft: 18 / 430 * screenWidth, alignSelf: 'flex-start' }}></View>


                    </View>
                </View>

                <TouchableOpacity style={[GlobalStyles.capsuleBtn]}
                    onPress={()=>{
                        navigation.push(ScreenNames.PaySettleAmountScreen,{
                            review:item
                        })
                    }}
                >

                    <Text style={[GlobalStyles.BtnText]}>
                        Pay Settlement(${item.settlementOfferObject&&item.settlementOfferObject.amount})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style = {{alignSelf:'center',marginTop:20}}
                    onPress={()=>{
                        navigation.goBack()
                    }}
                >
                    <Text style = {[GlobalStyles.BtnText,{color:Colors.orangeColor}]}>
                        Reject
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SettleReviewDetailsScreen