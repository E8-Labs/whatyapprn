import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, StyleSheet, Modal } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { BarChart } from 'react-native-chart-kit';

import { screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { ScreenNames } from '../../../res/ScreenNames'
import { Colors } from '../../../res/Colors'
import FilterPoopup from '../../../components/FilterPoopup';

const image = require('../../../assets/Images/profileImage.png')

const AdminUserMainScreen = () => {

  const Users = [
    {
      id: 1,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      yapScore: 20
    },
    {
      id: 2,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      yapScore: 20
    },
    {
      id: 3,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      yapScore: 20
    },
    {
      id: 4,
      name: 'Apple',
      city: 'San Francisco , CA',
      image: image,
      yapScore: 20
    },
  ]

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
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
              <Text style={[GlobalStyles.text14, { color: '#00000036' }]}> Total businesses:
                <Text style={{ fontSize: 13, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                  785
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
          data={Users}
          keyExtractor={(item) => item.id}

          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={{
                width: screenWidth - 30, alignItems: 'center', flexDirection: 'row', justifyContent: "space-between", marginTop: 24 / 930 * screenHeight

              }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <Image source={item.image}
                    style={GlobalStyles.image24}
                  />
                  <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                    <Text style={[GlobalStyles.text17, { color: '#000' }]}>
                      {item.name}
                    </Text>
                    <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                      {item.city}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Image source={require('../../../assets/Images/starIcon.png')}
                        style={{ height: 14, width: 14, tintColor: '#FFC107' }}
                      />
                      <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                        {item.reviews} reviews
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 4,backgroundColor:'#C0C0C020',padding:8,borderRadius:30 }}>
                  <View style={{ flexDirection: 'row', }}>
                    <Image source={require('../../../assets/Images/yIcon.png')}
                      style={GlobalStyles.yIcon}
                    />
                    <Text style={{ fontSize: 14, fontFamily: CustomFonts.InterMedium, color: "#00000080" }}>
                      ap score
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontFamily: CustomFonts.IntriaBold, color: 'black' }}>
                    {item.yapScore ? item.yapScore : 'N/A'}
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