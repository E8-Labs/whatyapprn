import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'
import { ReviewTypes } from '../../res/ReviewsTypes'

const ActivePastReviews = ({ navigation, reviews,role }) => {

  // console.log('reviews on past ', reviews)

    const image1 = require('../../assets/Images/profileImage.png')
    const image2 = require('../../assets/Images/profileImage2.png')

    const selectView = (item) => {
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
        } else {
          console.log("#######################################################")
          console.log(`noting for ${item.service} | st: ${item.reviewStatus} Cust: ${item.newActivityByCustomer} Bus: ${item.newActivityByBusiness} role: ${role}`);
          // console.log(`noting for2 ${item.service} | st: ${item.reviewStatus} Cust: ${newActivityByCustomer} Bus: ${newActivityByBusiness}`);
          // console.log("#######################################################")
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
                                    console.log('item is', item)
                                    // return
                                    navigation.push(ScreenNames.ReviewDetailsScreen, {

                                        reviewDetails: {
                                            review: item,
                                            from: 'past',
                                        }
                                    })
                                }}
                            >
                                <View style={{ marginTop: 10 / 930 * screenHeight, flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, width: screenWidth - 40 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={item.business.profile_image ? { uri: item.business.profile_image } : placeholderImage}
                                            style={GlobalStyles.image37}
                                        />
                                        <Image source={item.customer.profile_image ? { uri: item.customer.profile_image } : placeholderImage}
                                            style={{
                                                height: 36 / 930 * screenHeight, width: 36 / 430 * screenWidth, borderWidth: 2,
                                                borderColor: 'white', borderRadius: 20, marginLeft: -15
                                            }}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'column', alignItems: 'center', width: 335 / 430 * screenWidth, }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap:15, width: 335 / 430 * screenWidth, }}>
                                            <Text numberOfLines={1} style={{
                                                width: 120 / 430 * screenWidth, fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                                            }}>
                                                {item.service}
                                            </Text>
                                            <Text style={{ fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold }}>
                                                (${item.amountOfTransaction})
                                            </Text>
                                          {selectView(item)}
                                        </View>
                                        <View style={{ flexDirection: 'column', alignSelf: 'flex-start', marginTop: 8 / 930 * screenHeight, gap: 8 }}>
                                            <Text style={GlobalStyles.text14}>
                                                Transaction date: {item.dateOfTransaction.replace(/\s+/g, '')}
                                            </Text>

                                        </View>
                                    </View>
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

export default ActivePastReviews