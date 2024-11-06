import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
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

import axios from 'axios';
import LoadingAnimation from '../../../components/LoadingAnimation';


const image = require('../../../assets/Images/profileImage.png')

const AdminUserMainScreen = ({ navigation }) => {

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)

  const Users = [
    {
      id: 1,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      reviews: 400,
      createdAt: "12/09/2024"
    },
    {
      id: 2,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      reviews: 400,
      createdAt: "12/09/2024"
    },
    {
      id: 3,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      reviews: 400,
      createdAt: "12/09/2024"
    },
    {
      id: 4,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      reviews: 400,
      createdAt: "12/09/2024"
    },
  ]

  useEffect(() => {
    searchCustomers(0)
  }, [])

  const searchCustomers = async (offset = -1) => {
    if (offset == -1) {
      offset = customers.length;
    }
    try {
      console.log("trying to search customer");
      setLoading(true);
      const data = await AsyncStorage.getItem("USER");
      if (data) {
        let u = JSON.parse(data);

        let path = Apipath.searchCustomers;
        // if (searchQuery.length > 0) {
        //   path =
        //     `${path}?searchType=name` +
        //     "&offset=" +
        //     offset +
        //     "&role=customer";
        // } else {
        path = `${path}?` + "offset=" + offset + "&role=business";
        // }

        console.log("path is", path);
        const response = await axios.get(path, {
          headers: {
            Authorization: "Bearer " + u.token,
          },
        });
        if (response.data) {
          setLoading(false);
          // if(response.data.data.status === true ){}
          console.log("search response is", response.data);
          setBusinesses(response.data.data || []);
        }
      }
    } catch (e) {
      setLoading(false);
      console.log("ersror in search customers", e);
    }
  };

  const getProfile = async (item) => {
    setLoading(true)
    let data = await getCutomerProfile(item)
    console.log('data is', data)
    data.from = "adminDashboard"
    setLoading(false)
    if (data) {
      navigation.push(ScreenNames.CustomerProfileDetails, {
        user: item
      })
    }
  }


  return (
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 / 430 * screenWidth }}>
            <Image source={require('../../../assets/Images/mainIcon.png')}
              style={GlobalStyles.image37}
            />
            <View>
              <Text style={{ fontSize: 24, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                Customers
              </Text>
              <Text style={[GlobalStyles.text14, { color: '#00000036' }]}> Total Customers:
                <Text style={{ fontSize: 13, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                  {businesses.length}
                </Text>
              </Text>
            </View>
          </View>
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
              // showAnimation()
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
        {/* <Modal
           visible={showFilterPopup}
          animationType='slide'
          transparent={true}
        >
          <FilterPoopup close={() => {
             setShowFilter(false)
          }} />
        </Modal> */}


        <FlatList
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
                  <Image source={item.profil_image ? (item.profil_image) : placeholderImage}
                    style={GlobalStyles.image24}
                  />
                  <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                    <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                      {item.name}
                    </Text>
                    <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                      {item.city ? item.city : ''} {item.state ? `, ${item.state}` : 'N/A'}
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

                <View style={{ flexDirection: 'row', gap: 4, backgroundColor: '#C0C0C020', padding: 8, borderRadius: 30 }}>
                  <View style={{ flexDirection: 'row', }}>
                    <Image source={require('../../../assets/Images/yIcon.png')}
                      style={GlobalStyles.yIcon}
                    />
                    <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: "#00000080" }}>
                      ap score
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontFamily: CustomFonts.IntriaBold, color: 'black' }}>
                    { item.totalYapScore }
                  </Text>
                </View>

              </View>

              <View style={GlobalStyles.divider}></View>
            </TouchableOpacity>
          )}

        />
      </View>
    </SafeAreaView>
  )
}

export default AdminUserMainScreen