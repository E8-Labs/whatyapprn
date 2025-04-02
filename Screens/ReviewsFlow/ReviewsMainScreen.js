import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { screenHeight, screenWidth } from '../../res/Constants'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import React, { useCallback, useEffect, useState } from 'react'
import { CustomFonts } from '../../assets/font/Fonts'
import ActiveReviews from './ActiveReviews'
import ActiveSattlement from './ActiveSattlement'
import ActivePastReviews from './ActivePastReviews'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import LoadingAnimation from '../../components/LoadingAnimation'
import { ReviewTypes } from '../../res/ReviewsTypes'
import { useFocusEffect } from '@react-navigation/native'
import { ScreenNames } from '../../res/ScreenNames'

const ReviewsMainScreen = ({ navigation }) => {

  const [selectedMenu, setselectedMenu] = useState("active")
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const [user, setUser] = useState("")

  const menues = [
    {
      id: 1,
      name: "Active",
      value: ReviewTypes.Active
    },
    {
      id: 2,
      name: "Settlement",
      value: ReviewTypes.Settlement
    },
    {
      id: 3,
      name: "Past",
      value: ReviewTypes.Past
    }
  ]
  useFocusEffect(
    useCallback(() => {
      checkUserRole()
      getReviews()
    }, [selectedMenu])
  )

  const checkUserRole = async () => {
    const data = await AsyncStorage.getItem("USER")
    if (data) {
      let u = JSON.parse(data)
      setUser(u.user)
      setRole(u.user.role)
      console.log('user data in user role function is', u.user.role)
    }
  }

  const getReviews = async () => {
    try {
      setLoading(true)
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)

        let path = Apipath.getReviews + "?reviewStatus=" + selectedMenu
        console.log('path is', path)

        const response = await axios.get(path, {
          headers: {
            "Authorization": 'Bearer ' + u.token
          }
        })

        if (response.data) {
          setLoading(false)
          if (response.data.status === true) {
            console.log('reviews are', response.data.data)
            setReviews(response.data.data)
          } else {
            console.log('get reviews message is', response.data.message)
          }
        } else {
          console.log('no response', response)
        }
      }
    } catch (e) {
      console.log('error in get reviews api', e)
    }
  }



  return (
    <View style={GlobalStyles.container} >
      {
        loading && (
          <LoadingAnimation visible={loading} />
        )
      }
      <View>
        <View style={{
          width: screenWidth, alignItems: 'center', backgroundColor: 'white', paddingBottom: 8,
          shadowColor: 'gray', shadowOpacity: 0.2, shadowOffset: { height: 2, width: 0 }, paddingTop: 50 / 930 * screenHeight
        }}>
          <View style={{
            width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 20 / 930 * screenHeight,
          }}>
            <Text style={{ fontSize: 24, fontFamily: CustomFonts.PoppinsMedium }}>
              Reviews
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push(ScreenNames.MessagesListScreen)
                }}
              >
                <Image source={require('../../assets/Images/messageIcon.png')}
                  style={GlobalStyles.image24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.push(ScreenNames.NotificationsScreen)
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'fex-start', justifyContent: 'flex-start' }}>
                  {
                    user?.unread != 0 && (
                      <View style={{ height: 8, width: 8, borderRadius: 5, backgroundColor: Colors.orangeColor, marginRight: -5 }}></View>
                    )
                  }
                  <Image source={require('../../assets/Images/notificationIcon.png')}
                    style={GlobalStyles.image24}
                  />
                </View>

              </TouchableOpacity>
            </View>
          </View>
          {
            role && role != "customer"&&(

              <View style={{ paddingLeft: 25 / 430 * screenWidth, width: screenWidth - 80, marginTop: 15 / 930 * screenHeight, alignSelf: 'flex-start' }}>
                <Text style={{ fontSize: 13, fontFamily: CustomFonts.PoppinsRegular, flexWrap: 'wrap' }}>
                  Post a review to get your business account ranked higher.{' '}
                  <Text
                    onPress={() => {
                      navigation.push(ScreenNames.LearnMore)
                    }}
                    style={{ color: Colors.orangeColor }}
                  >
                    Learn More
                  </Text>
                </Text>
              </View>
            )
          }

          <View style={{
            flexDirection: 'row', alignItems: 'center', width: screenWidth - 80, justifyContent: 'space-between',
            marginTop: 20 / 930 * screenHeight
          }}>
            {
              menues.map((item) => (
                <View key={item.id} style={{ flexDirection: 'column', }}>
                  <TouchableOpacity
                    onPress={() => {
                      setselectedMenu(item.value)
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 / 430 * screenWidth, paddingHorizontal: 15 }}>
                      <Text style={[GlobalStyles.text17, { color: selectedMenu === item.value ? "black" : "#00000080" }]}>
                        {item.name}
                      </Text>
                      {
                        item.id === 2 && (
                          <Image source={require('../../assets/Images/notIcon.png')}
                            style={{ height: 16, width: 16 }}
                          />
                        )
                      }

                    </View>
                  </TouchableOpacity>
                  {
                    selectedMenu === item.value && (
                      <View style={{ height: 2, backgroundColor: Colors.orangeColor, marginTop: 5, }}></View>
                    )
                  }
                </View>

              ))
            }
          </View>
        </View>

        <View style={{ marginTop: 20 / 930 * screenHeight, alignItems: 'center', marginBottom: 20 / 930 * screenHeight }}>
          <ActiveReviews navigation={navigation} reviews={reviews} role={role} />
          {/* {
            selectedMenu === ReviewTypes.Active ? (
              <ActiveReviews navigation={navigation} reviews={reviews} role={role} />
            ) : (
              selectedMenu === ReviewTypes.Settlement ? (
                <ActiveSattlement navigation={navigation} reviews={reviews} role={role} />
              ) : (
                selectedMenu === ReviewTypes.Past && (
                  <ActivePastReviews navigation={navigation} reviews={reviews} role={role} />
                )
              )
            )
          } */}
        </View>
      </View>
    </View>
  )
}

export default ReviewsMainScreen