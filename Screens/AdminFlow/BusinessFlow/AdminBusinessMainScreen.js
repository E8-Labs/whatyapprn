import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Modal, Animated, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { BarChart } from 'react-native-chart-kit';
import SearchScreen from '../../DiscoverFlow/SearchScreen';

import { Apipath } from '../../../Api/Apipaths';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { placeholderImage, screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { ScreenNames } from '../../../res/ScreenNames'
import { Colors } from '../../../res/Colors'
import FilterPoopup from '../../../components/FilterPoopup';
import { getCutomerProfile } from '../../../components/GetCustomerProfile'

import axios from 'axios';
import LoadingAnimation from '../../../components/LoadingAnimation';
import { useFocusEffect } from '@react-navigation/native';
import AdminFilterPopup from '../../../components/AdminUserFilterPopup';
import moment from 'moment';


const image = require('../../../assets/Images/profileImage.png')

const AdminBusinessMainScreen = ({ navigation }) => {

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showSearch, setshowSearch] = useState(false)
  const [offset, setOffset] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [adminData, setAdminData] = useState(null)

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
  useFocusEffect(
    useCallback(() => {
      getAdminDataFromLocal()
      searchCustomers(0)
    }, [])
  )


  const getAdminDataFromLocal = async () => {
    const data = await AsyncStorage.getItem("AdminData")
    if (data) {
      let d = JSON.parse(data)
      console.log('admin data from local is', d)
      setAdminData(d)
    }
  }

  const searchCustomers = async (currentOffset = 0, filters) => {
    console.log('currentOffset', currentOffset)
    console.log('filters in searcch customer', filters)

    try {
      if (currentOffset === 0) setLoading(true);
      else setIsFetchingMore(true);

      const data = await AsyncStorage.getItem('USER');
      if (data) {
        let user = JSON.parse(data);
        let path = `${Apipath.searchCustomers}?offset=${currentOffset}&role=business`;
        if (filters) {
          if (filters.city) {
            path = path + "&city=" + filters.city
          }
          if (filters.state) {
            path = path + "&state=" + filters.state
          }
          if (filters.fromDate) {
            path = path + "&fromDate=" + filters.fromDate
          }
          if (filters.toDate) {
            path = path + "&toDate=" + filters.toDate
          }
          if (filters.minYapScore) {
            path = path + "&minYapScore=" + filters.minYapScore
          }
          if (filters.maxYapScore) {
            path = path + "&maxYapScore=" + filters.maxYapScore
          }
          if (filters.minReviewCout) {
            path = path + "&minReviewCout=" + filters.minReviewCout
          }
          if (filters.maxReviewCount) {
            path = path + "&maxReviewCount=" + filters.maxReviewCount
          }
        }

        console.log('path is', path);

        // return
        const response = await axios.get(path, {
          headers: {
            Authorization: 'Bearer ' + user.token,
          },
        });
        if (response.data) {
          if (response.data.status === true) {
            const newBusinesses = response.data.data || [];
            console.log('businesses list is', newBusinesses.length);

            // Update businesses list
            setBusinesses(prevBusinesses =>
              currentOffset === 0 ? newBusinesses : [...prevBusinesses, ...newBusinesses]
            );
            if (newBusinesses.length > 0) {
              setOffset(currentOffset + newBusinesses.length);
            } else {
              setHasMoreData(false);
            }
          }
        } else {
          console.log('business api error is', response.data.message);
        }
      }
    } catch (e) {

      console.log('Error in fetching business', e);
    } finally {
      setLoading(false);
      setIsFetchingMore(false); // Reset fetching more state
    }
  };

  const getProfile = async (item) => {
    setLoading(true)
    let data = await getCutomerProfile(item)
    console.log('data is', data)
    data.from = "adminDashboard"
    setLoading(false)
    if (data) {
      navigation.push(ScreenNames.AdminBusinessProfileDetailsScreen, {
        user: item
      })
    }
  }
  const loadMoreData = () => {
    if (!isFetchingMore && !loading && hasMoreData) {
      setIsFetchingMore(true);
      searchCustomers(offset);
    }
  };

  const closeModal = (filters) => {
    setshowSearch(false)
    setShowFilter(false)
    if (filters) {
      setBusinesses([])
      searchCustomers(0, filters)
    }
  }


  return (
    showSearch ? (
      <Animated.View style={{ opacity: searchAnim }}>
        <SearchScreen navigation={navigation} hideAnimation={hideAnimation} />
      </Animated.View>

    ) : (
      <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
        {
          loading ? (
            <LoadingAnimation visible={loading} />
          ) :


            <View style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
              <View style={{
                width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 20 / 930 * screenHeight
              }}>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 / 430 * screenWidth }}>
                  <Image source={require('../../../assets/Images/mainIcon.png')}
                    style={GlobalStyles.image37}
                  />
                  <View>
                    <Text style={{ fontSize: 24, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                      Businesses
                    </Text>
                    <Text style={[GlobalStyles.text14, { color: '#00000036' }]}> Total businesses:
                      <Text style={{ fontSize: 13, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                        {adminData && adminData.totalBusinesses}
                      </Text>
                    </Text>
                  </View>
                </View> */}

                <Image source={require('../../../assets/Images/logo.png')}
                  style={GlobalStyles.logoImage}
                />
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
                    Search by email or name
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
                <AdminFilterPopup close={closeModal} />
              </Modal>

              <View style={{ height: screenHeight * 0.65 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={businesses}
                  keyExtractor={(item) => item.id}

                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        getProfile(item)
                      }}
                    >
                      <View style={{
                        width: screenWidth - 30, alignItems: 'center', flexDirection: 'row', justifyContent: "space-between", marginTop: 24 / 930 * screenHeight

                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                          <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage}
                            style={[GlobalStyles.image24, { borderRadius: 20 }]}
                          />
                          <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                            <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                              {item.name}
                            </Text>
                            <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                              {item.city ? item.city : ''} {item.state ? `, ${item.state}` : ''}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                              <Image source={require('../../../assets/Images/starIcon.png')}
                                style={{ height: 14, width: 14, tintColor: '#FFC107' }}
                              />
                              <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                                {item.totalReviews} reviews
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 20 / 930 * screenHeight }}>
                          <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                            Created on {moment(item.createdAt).format("MMM DD")}
                          </Text>
                          <Image source={require('../../../assets/Images/farwordArrow.png')}
                            style={GlobalStyles.image24}
                          />
                        </View>

                      </View>

                      <View style={GlobalStyles.divider}></View>
                    </TouchableOpacity>
                  )}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold={0.7}
                  ListFooterComponent={isFetchingMore ? <ActivityIndicator size={'large'} color={Colors.orangeColor} /> : null}
                />
              </View>
            </View>
        }
      </SafeAreaView>
    )
  )
}

export default AdminBusinessMainScreen