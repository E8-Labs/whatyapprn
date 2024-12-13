import { View, Text, SafeAreaView, Image, TouchableOpacity, Animated, FlatList, StyleSheet, Modal } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { BarChart } from 'react-native-chart-kit';

import { Apipath } from '../../../Api/Apipaths';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { placeholderImage, screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { ScreenNames } from '../../../res/ScreenNames'
import { Colors } from '../../../res/Colors'
import FilterPoopup from '../../../components/FilterPoopup';
import { getCutomerProfile } from '../../../components/GetCustomerProfile'
import SearchScreen from '../../DiscoverFlow/SearchScreen';
import axios from 'axios';
import LoadingAnimation from '../../../components/LoadingAnimation';
import { useFocusEffect } from '@react-navigation/native';
import AdminResolutionFilterPopup from '../../../components/AdminResolutionFilterPopup';


const image = require('../../../assets/Images/profileImage.png')

const AdminResolutionsMainScreen = ({ navigation }) => {

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [resolutions, setResolutions] = useState([])
  const [showSearch, setshowSearch] = useState(false)


  const image1 = require('../../../assets/Images/profileImage.png')
  const image2 = require('../../../assets/Images/profileImage2.png')

  useFocusEffect(
    useCallback(() => {
      getResolutions()
    }, [])
  )

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
    }).start(() => setshowSearch(false))
  }

  const getResolutions = async (filters) => {
    console.log('filters in get resolutions function', filters)
    // return
    const data = await AsyncStorage.getItem("USER")
    if (data) {
      let u = JSON.parse(data)
      setLoading(true)
      try {
        let path = Apipath.getResolutions
        if(filters){
          
          path = path + "?active="+filters.active+"&disputeStatus="+filters.disputeStatus+"&maxAmount="+filters.maxAmount+
          "&minAmount="+filters.minAmount+"&resolved="+filters.resolved
        }
        console.log('path', path)
// return
        const response = await axios.get(path, {
          headers: {
            "Authorization": "Bearer " + u.token
          }
        })
        if (response.data) {
          setLoading(false)
          if (response.data.status === true) {
            console.log('resolutions data is', response.data.data)
            setResolutions(response.data.data)
          } else {
            console.log('darshboard api message is', response.data.message)
          }
        }
      } catch (e) {
        setLoading(false)
        console.log('error in dashboard api ', e)
      }
    }
  }

  const closeModal = (filters) => {
    console.log('filters', filters)
    if (filters) {
      getResolutions(filters)
    }
    setShowFilter(false)
  }


  return (
    showSearch ? (
      <Animated.View style={{ opacity: searchAnim }}>
        <SearchScreen navigation={navigation} hideAnimation={hideAnimation} />
      </Animated.View>

    ) :
      <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
        {
          loading && (
            <LoadingAnimation visible={loading} />
          )
        }
        <View style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
          <View style={{
            width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 20 / 930 * screenHeight
          }}>

            <Text style={{ fontSize: 24, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
              Resolutions
            </Text>
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
                search by username or business name
              </Text>
              <Image source={require('../../../assets/Images/searchIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowFilter(true)
              }}
            >
              <Image source={require('../../../assets/Images/filterIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
          </View>

          {/* Filter popup*/}
          <Modal
            visible={showFilter}
            animationType='slide'
            transparent={true}
          >
            <AdminResolutionFilterPopup close={closeModal} />
          </Modal>

          <View style={{ height: screenHeight * 0.68 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={resolutions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.id}
                  onPress={() => {
                    navigation.push(ScreenNames.ReviewDetailsScreen, {
                      reviewDetails: {
                        review: item,
                        from: 'active',
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
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Image source={item.customer && item.customer.profile_image ? { uri: item.customer && item.customer.profile_image } : placeholderImage}
                                style={[GlobalStyles.image37,]}
                              />
                              <Image source={item.business && item.business.profile_image ? { uri: item.business && item.business.profile_image } : placeholderImage}
                                style={[GlobalStyles.image37, { marginLeft: -15 / 430 * screenWidth }]}
                              />
                            </View>
                            <Text numberOfLines={1} style={{
                              fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                              width: 120 / 430 * screenWidth, borderWidth: 0
                            }}>
                              {item.service}
                            </Text>
                            <Text numberOfLines={1} style={{
                              fontSize: 17 / 930 * screenHeight, fontFamily: CustomFonts.InterSemibold,
                            }}>
                              ${item.amountOfTransaction}
                            </Text>
                          </View>
                          <View style={{
                            backgroundColor: '#FF570010', padding: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4
                          }}>
                            <Image source={require('../../../assets/Images/notIcon.png')}
                              style={{ height: 16, width: 16 }}
                            />
                            <Text style={{ fontSize: 12, fontFamily: CustomFonts.InterMedium, color: Colors.orangeColor }}>
                              Admin review
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'column', alignSelf: 'flex-start', gap: 10, marginLeft: 60 / 430 * screenWidth, marginTop: 5 }}>
                          <Text style={[GlobalStyles.text14, {}]}>
                            Transaction date: {item.dateOfTransaction}
                          </Text>
                          <Text numberOfLines={2} style={[GlobalStyles.text14, { color: '#00000043' }]}>
                            {item.notesAboutCustomer}
                          </Text>

                        </View>
                      </View>
                    }
                  </View>
                  <View style={GlobalStyles.divider}></View>
                </TouchableOpacity>
              )}

            />
          </View>

        </View>
      </SafeAreaView >
  )
}

export default AdminResolutionsMainScreen