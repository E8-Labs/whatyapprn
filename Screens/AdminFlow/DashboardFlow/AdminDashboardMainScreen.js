import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { Image } from 'expo-image'
import { placeholderImage, screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { ScreenNames } from '../../../res/ScreenNames'
import { Colors } from '../../../res/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../../Api/Apipaths'


const AdminDashboardMainScreen = ({ navigation }) => {


  const image = require('../../../assets/Images/profileImage.png')

  const [dashboardata, setDashboardData] = useState(null)
  const [rescentBusinesses, setRecentBusonesses] = useState([])


  const newUsers = [
    {
      id: 1,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image
    },
    {
      id: 2,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image
    },
    {
      id: 3,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image
    },
    {
      id: 4,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image
    },
  ]

  useEffect(() => {
    getDashboardData()
  }, [])

  const getDashboardData = async () => {
    const data = await AsyncStorage.getItem("USER")
    if (data) {
      let u = JSON.parse(data)
      try {
        const response = await axios.get(Apipath.getAdminDashboardData, {
          headers: {
            "Authorization": "Bearer " + u.token
          }
        })
        if (response.data) {
          if (response.data.status === true) {
            console.log('dashboard data is', response.data.data)
            setDashboardData(response.data.data)
            setRecentBusonesses(response.data.data.recentBusinesses)
            let d = response.data.data
            let data = {
              totalCustomers:d.customers ,
              totalBusinesses: d.businesses,
              totalReviews: d.totalReviews,
              activeReviews: d.activeReviews,
            }
            AsyncStorage.setItem("AdminData",JSON.stringify(data))
          } else {
            console.log('darshboard api message is', response.data.message)
          }
        }
      } catch (e) {
        console.log('error in dashboard api ', e)
      }
    }
  }

  const logoutUser = async () => {

    AsyncStorage.removeItem("USER")
    navigation.replace(ScreenNames.LoginScreen)
  }


  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
      <View style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
        <View style={{
          width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 20 / 930 * screenHeight
        }}>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 / 430 * screenWidth }}> */}
            <Image source={require('../../../assets/Images/logo.png')}
              style={GlobalStyles.logoImage}
            />
            {/* <Text style={{ fontSize: 24, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
              Resolution
            </Text>
          </View> */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.MessagesListScreen)
              }}
            >
              <Image source={require('../../../assets/Images/messageIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.NotificationsScreen)
              }}
            >
              <Image source={require('../../../assets/Images/notificationIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ height: screenHeight * 0.76, borderWidth: 0 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={{
              height: 360 / 930 * screenHeight, width: screenWidth - 30, flexDirection: 'column',
              gap: 15 / 930 * screenHeight, marginTop: 50 / 930 * screenHeight
            }}>

              <View style={{ flexDirection: 'row', gap: 15 / 430 * screenWidth }}>

                <View style={{
                  height: 92 / 930 * screenHeight, width: 218 / 430 * screenWidth, backgroundColor: Colors.orangeColor, borderRadius: 16,
                  paddingVertical: 14 / 930 * screenHeight, paddingHorizontal: 20 / 430 * screenWidth
                }}>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate(ScreenNames.AdminUserMainScreen)
                  }}>
                    <View style={{ width: 180 / 430 * screenWidth, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'column', alignItems: 'center', gap: 8 / 930 * screenHeight, }}>
                        <Image source={require('../../../assets/Images/usersIcon.png')}
                          style={[GlobalStyles.image24, { tintColor: 'white' }]}
                        />
                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium, color: 'white' }}>
                          Users
                        </Text>
                      </View>
                      <View style={{
                        alignSelf: 'flex-end', marginTop: 10, alignItems: 'flex-end', flexDirection: 'column',
                        gap: 7
                      }}>
                        <Text style={{ fontSize: 24, fontFamily: CustomFonts.PoppinsMedium, color: 'white' }}>
                          {dashboardata && dashboardata.customers}
                        </Text>
                        <TouchableOpacity style={{ marginRight: 0 }}>

                          <Text style={{ fontSize: 12, fontFamily: CustomFonts.PoppinsMedium, color: 'white', }}>
                            View all
                          </Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </TouchableOpacity>

                </View>

                <TouchableOpacity onPress={() => {
                  navigation.navigate(ScreenNames.AdminResolutionsMainScreen)
                }}>
                  <View style={{
                    width: 167 / 430 * screenWidth, height: 190 / 930 * screenHeight, backgroundColor: '#222222',
                    borderRadius: 16, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start',
                    paddingVertical: 18, paddingHorizontal: 18
                  }}>

                    <View style={{ flexDirection: 'column', gap: 15 }}>
                      <Image source={require('../../../assets/Images/disputeIcon.png')}
                        style={[GlobalStyles.image24, { tintColor: '#F44336' }]}
                      />

                      <Text style={[GlobalStyles.text12, { color: 'white' }]}>
                        Resolutions
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'column', gap: 8 }}>
                      <Text style={{ fontSize: 24, fontFamily: CustomFonts.PoppinsMedium, color: 'white' }}>
                        {dashboardata && dashboardata.activeReviews}
                      </Text>
                      <Text style={[GlobalStyles.text12, { color: '#ffffff70' }]}>
                        Resolutions
                      </Text>
                    </View>


                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 15 / 430 * screenWidth }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(ScreenNames.AdminBusinessMainScreen)
                  }}
                >
                  <View style={{
                    height: 254 / 930 * screenHeight, width: 219 / 430 * screenWidth, backgroundColor: '#222222',
                    borderRadius: 16, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start',
                    paddingVertical: 18, paddingHorizontal: 18, marginTop: -100 / 930 * screenHeight

                  }}>

                    <View style={{ flexDirection: 'column', gap: 15 }}>
                      <Image source={require('../../../assets/Images/businessIcon.png')}
                        style={[GlobalStyles.image24, { tintColor: '#fff' }]}
                      />

                      <Text style={[GlobalStyles.text17, { color: 'white' }]}>
                        Businesses
                      </Text>
                    </View>

                    <View style={{
                      flexDirection: 'row', justifyContent: 'space-between', width: 180 / 430 * screenWidth,
                      alignItems: 'center'
                    }}>
                      <Text style={{ fontSize: 24, fontFamily: CustomFonts.PoppinsMedium, color: 'white' }}>
                        {dashboardata && dashboardata.businesses}
                      </Text>
                      <Text style={[GlobalStyles.text12, { color: '#ffffff' }]}>
                        View all
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={{
                  width: 167 / 430 * screenWidth, height: 156 / 930 * screenHeight, backgroundColor: '#F0F0F0',
                  borderRadius: 16, flexDirection: 'column', gap: 15 / 930 * screenHeight, alignItems: 'flex-start',
                  paddingVertical: 18, paddingHorizontal: 18,
                }}>
                  <Image source={require('../../../assets/Images/starIcon.png')}
                    style={GlobalStyles.image24}
                  />

                  <Text style={[GlobalStyles.text12, { color: '#000' }]}>
                    Reviews
                  </Text>
                  <Text style={{ fontSize: 24, fontFamily: CustomFonts.PoppinsMedium, }}>
                    {dashboardata && dashboardata.totalReviews}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenNames.AdminAnalyticsMainScreen)
              }}
            >
              <View style={{
                width: screenWidth - 30, height: 106 / 930 * screenHeight, backgroundColor: 'white', paddingVertical: 17,
                paddingHorizontal: 19, shadowColor: '#00000025', shadowOffset: {
                  height: 7, width: 4
                }, shadowOpacity: 0.9, marginTop: 10, borderRadius: 16,
              }}>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: screenWidth - 60,
                }}>
                  <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 30 / 930 * screenHeight, }}>
                    <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                      Analytics
                    </Text>

                    <Text style={GlobalStyles.text12}>
                      Revenue . Business . Resolution . Reviews
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 20 / 930 * screenHeight, }}>
                    <Image source={require('../../../assets/Images/graph.png')}
                      style={{ height: 34 / 940 * screenHeight, width: 67 / 430 * screenWidth, resizeMode: 'contain' }}
                    />

                    <Text style={[GlobalStyles.text12, { color: Colors.orangeColor }]}>
                      View all
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>


            <Text style={[GlobalStyles.text14, { marginTop: 20, marginBottom: 20, color: '#00000080' }]}>
              Recently Registered Business
            </Text>

            <FlatList
              scrollEnabled={false}
              data={rescentBusinesses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push(ScreenNames.AdminBusinessProfileDetailsScreen, {
                      user: item,
                    })
                  }}
                >
                  <View style={{
                    width: screenWidth - 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between',
                    marginTop: 20
                  }}>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}>
                      <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage}
                        style={GlobalStyles.image37}
                      />
                      <View style={{ flexDirection: 'column', gap: 10 }}>
                        <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                          {item.name}
                        </Text>

                        <Text style={GlobalStyles.text12}>
                          {item.city ? item.city : ''} {item.state ? ` ,${item.state}` : ''}
                        </Text>
                      </View>
                    </View>
                    <Image source={require('../../../assets/Images/blackFarwordBtn.png')}
                      style={{ height: 31 / 930 * screenHeight, width: 31 / 930 * screenHeight, resizeMode: 'contain' }}
                    />
                  </View>

                  <View style={[GlobalStyles.divider, { marginTop: 20 / 930 * screenHeight }]}></View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={{ marginLeft: 80 / 430 * screenWidth }}
              onPress={logoutUser}
            >
              <Text style={[GlobalStyles.BtnText, { color: 'red' }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AdminDashboardMainScreen