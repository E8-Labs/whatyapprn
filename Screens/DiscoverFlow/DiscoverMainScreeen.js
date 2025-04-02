import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Animated, Modal } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image } from 'expo-image'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { placeholderImage, screenHeight, screenWidth } from '../../res/Constants'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import SearchScreen from './SearchScreen'
import FilterPoopup from '../../components/FilterPoopup'
import { ScreenNames } from '../../res/ScreenNames'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import { getCutomerProfile } from '../../components/GetCustomerProfile'
import LoadingAnimation from '../../components/LoadingAnimation'
import calculateSpent from '../../res/CalculateSpent'
import { useFocusEffect } from '@react-navigation/native'


const profileImage = require('../../assets/Images/profileImage.png')

const DiscoverMainScreeen = ({ navigation }) => {

  const [showSearch, setshowSearch] = useState(false)
  const [showFilterPopup, setShowFilter] = useState(false)
  const [customersNearMe, setCustomersNearMe] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("")
  const [user, setUser] = useState("")

  const searchAnim = useRef(new Animated.Value(0)).current

  const showAnimation = () => {
    Animated.timing(searchAnim, {
      toValue: 1, // Fade to full opacity
      duration: 1000, // Animation duration
      useNativeDriver: true, // Native driver for performance
    }).start();
    setshowSearch(true)

  };

  const hideAnimation = () => {
    setshowSearch(true)
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setshowSearch(false)
      setShowFilter(false)
    })
  }

  useFocusEffect(
    useCallback(() => {
      getDashboardData()
    }, [])
  )

  useEffect(() => {
    // getDashboardData()
  }, [])

  const getDashboardData = async () => {
    console.log('trying to call dashboard apip')
    try {
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)
        setRole(u.user.role)
        setUser(u.user)
        console.log('user data is', u.user.id)
        const response = await axios.get(Apipath.getDashboardData, {
          headers: {
            "Authorization": 'Bearer ' + u.token
          }
        })
        // console.log('response', response)

        if (response.data) {
          console.log('dashboard data is', response.data.data)
          if (response.data.data) {
            setCustomersNearMe(response.data.data.customers_nearby)
            setRecentlyViewed(response.data.data.recently_viewed)
          }
        } else {
          console.log('response not ok')
        }
      }
    } catch (e) {
      console.log('dashboard api error is', e)
    }
  }


  const getProfile = async (item) => {
    setLoading(true)
    let data = await getCutomerProfile(item)
    console.log('data is', data)
    data.from = "discover"
    setLoading(false)
    if (data) {
      if (item.role === "customer") {
        navigation.push(ScreenNames.CustomerProfileDetails, {
          user: item,
          from: 'User'
        })
      }else{
        navigation.push(ScreenNames.BusinessInfoScreen, {
          user: item,
          from: 'User'
        })
      }
    }
  }

  return (
    showSearch ? (
      <Animated.View style={{ opacity: searchAnim }}>

        <SearchScreen navigation={navigation} hideAnimation={hideAnimation}
          from={showFilterPopup ? "filter" : ''}
        />
      </Animated.View>

    ) : (
      <SafeAreaView style={{ alignItems: 'center', height: screenHeight, width: screenWidth }} >
        {
          loading && (
            <LoadingAnimation visible={loading} />
          )
        }
        <View style={{
          width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 8 / 930 * screenHeight
        }}>
          <Image source={require('../../assets/Images/logo.png')}
            style={GlobalStyles.logoImage}
          />
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

        <View style={{
          width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 20 / 930 * screenHeight
        }}>
          {/* search button */}


          <TouchableOpacity style={[GlobalStyles.input, {
            flexDirection: 'row', justifyContent: 'space-between', width: 330 / 430 * screenWidth,
            alignItems: 'center'
          }]}
            onPress={() => {
              showAnimation()
            }}
          >
            <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterRegular }}>
              Search
            </Text>
            <Image source={require('../../assets/Images/searchIcon.png')}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!role) {
                console.log('role is', role)
                return
              }
              setShowFilter(true)
              showAnimation()
            }}
          >
            <Image source={require('../../assets/Images/filterIcon.png')}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>
        </View>

        {/* Filter popup*/}
        <Modal
          visible={false}
          animationType='slide'
          transparent={true}
        >
          <FilterPoopup close={() => {
            setShowFilter(false)
          }} />
        </Modal>

        <View style={{ height: screenHeight * 0.69 }}>
          <ScrollView style={{}} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={[GlobalStyles.text17, { textAlign: 'left', marginTop: 25 / 930 * screenHeight, width: screenWidth - 40 }]}>
                Recently Viewed
              </Text>

              <View style={{ width: screenWidth - 20, marginTop: 30 / 930 * screenHeight }}>
                <ScrollView horizontal style={{}} showsHorizontalScrollIndicator={false}>
                  <View style={{ alignItems: 'center', flexDirection: 'row', gap: 20 / 430 * screenWidth, }}>
                    {
                      recentlyViewed && recentlyViewed.length > 0 ? (
                        recentlyViewed && recentlyViewed.map((item) => (
                          <TouchableOpacity onPress={() => getProfile(item)}>
                            <View key={item.id} style={{
                              backgroundColor: 'white', alignItems: 'center', padding: 20, borderRadius: 10, width: 240 / 430 * screenWidth
                            }}>
                              <View style={{ width: 200 / 430 * screenWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* <View style={{
                              height: 36 / 930 * screenHeight, width: 36 / 430 * screenWidth, borderRadius: 20, borderWidth: 2, borderColor: Colors.orangeColor,
                            }}> */}

                                <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage}
                                  style={{
                                    height: 36 / 930 * screenHeight, width: 36 / 930 * screenHeight, borderRadius: 20, borderWidth: 2, borderColor: 'white',
                                    resizeMode: 'cover'
                                  }}
                                />
                                {/* </View> */}
                                {
                                  item.role != "business" && (
                                    <View style={{ backgroundColor: "#FF570020", padding: 8 / 930 * screenHeight, alignItems: 'center', borderRadius: 20 }}>
                                      <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: Colors.orangeColor }}>
                                        Spent over {calculateSpent(item.totalSpent)}
                                      </Text>
                                    </View>
                                  )}
                              </View>
                              <View style={{
                                width: 200 / 430 * screenWidth, flexDirection: 'column', alignItems: 'flex-start',
                                marginTop: 20 / 930 * screenHeight, gap: 15
                              }}>
                                <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium, }}>
                                  {item.name}
                                </Text>

                                <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium, color: "#00000080" }}>
                                  {item.city ? item.city : ''} {item.state && `, ${item.state}`}
                                </Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200 / 430 * screenWidth }}>
                                  { }
                                  <View style={{ flexDirection: 'column', gap: 4 }}>
                                    <View style={{ flexDirection: 'row', }}>
                                      <Image source={require('../../assets/Images/yIcon.png')}
                                        style={GlobalStyles.yIcon}
                                      />
                                      <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: "#00000080" }}>
                                        ap score
                                      </Text>
                                    </View>
                                    <Text style={{ fontSize: 24, fontFamily: CustomFonts.IntriaBold, color: 'black' }}>
                                      {item.yapScore3Digit}
                                    </Text>
                                  </View>
                                  <View style={{ flexDirection: 'column', gap: 4 }}>
                                    <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: "#00000080" }}>
                                      Total Reviews
                                    </Text>
                                    <Text style={{ fontSize: 24, fontFamily: CustomFonts.IntriaBold, color: 'black' }}>
                                      {item.totalReviews}
                                    </Text>
                                  </View>
                                </View>




                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text style={[GlobalStyles.text14Intria, { alignSelf: 'center', marginLeft: 40 / 430 * screenWidth }]}>
                          No recently viewed
                        </Text>
                      )
                    }
                  </View>
                </ScrollView>

              </View>

              <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: screenWidth - 40,
                marginTop: 30 / 930 * screenHeight
              }}>
                <Text style={[GlobalStyles.text17,]}>
                  {role && role === "customer" ? "Businesses" : "Customers"} Near Me
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.push(ScreenNames.AllCustomersScreen, {
                      role: role
                    })
                  }}
                >
                  <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
                    View all
                  </Text>
                </TouchableOpacity>
              </View>

              {
                customersNearMe && customersNearMe.length > 0 ? (
                  customersNearMe.map((item) => (
                    <TouchableOpacity
                      onPress={() => getProfile(item)}
                    >
                      <View key={item.id} style={{
                        width: screenWidth - 40, alignItems: 'flex-start', flexDirection: 'column', gap: 5,
                        marginTop: 30 / 930 * screenHeight
                      }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' }}>

                          <View style={{ flexDirection: 'row', alignItems: "center", gap: 5 }}>
                            <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage}
                              style={{
                                height: 30 / 930 * screenHeight, width: 30 / 430 * screenWidth, borderRadius: 20, resizeMode: 'cover'
                              }}
                            />
                            <Text style={[GlobalStyles.text17, { color: 'black' }]}>
                              {item.name}
                            </Text>
                          </View>
                          {
                            item.role != "business" && (
                              <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium }}>
                                Spent over {calculateSpent(item.totalSpent)}
                              </Text>
                            )}
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginLeft: 30 / 430 * screenWidth }}>
                          <Text style={[GlobalStyles.text17, { color: '#00000080' }]}>
                            {item.city ? item.city : ''} {item.state && `, ${item.state}`}
                          </Text>
                          <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            width: screenWidth - 70, marginTop: 10
                          }}>
                            {
                              item.role != "business" && (
                                <View style={{ flexDirection: 'column', gap: 5 }}>

                                  <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterRegular }}>
                                    Yap score
                                  </Text>
                                  <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaBold }}>
                                    {item.yapScore3Digit}
                                  </Text>
                                </View>
                              )
                            }

                            <View style={{ flexDirection: 'column', gap: 5 }}>
                              <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterRegular }}>
                                Total Reviews
                              </Text>
                              <Text style={{ fontSize: 20, fontFamily: CustomFonts.IntriaBold }}>
                                {item.totalReviews ? item.totalReviews : 0}
                              </Text>
                            </View>

                            <Image source={require('../../assets/Images/farwordBtn.png')}
                              style={GlobalStyles.image37}
                            />
                          </View>
                        </View>


                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={[GlobalStyles.text14Intria, { alignSelf: 'flex-start', margin: 20 / 930 * screenHeight }]}>
                    No customers near me
                  </Text>
                )

              }

            </View>
          </ScrollView>
        </View>
      </SafeAreaView >
    )
  )
}

export default DiscoverMainScreeen