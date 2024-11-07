import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import React, { useState } from 'react'
import { Colors } from '../../res/Colors'
import { ScreenNames } from '../../res/ScreenNames'

const BuyCreditScreen = ({ navigation }) => {
  const [selectedPlan, setselectedPlan] = useState({})

  const selectedImage = require('../../assets/Images/selectedIcon.png')
  const unSelectedImage = require('../../assets/Images/unSelectedIcon.png')


  const plans = [
    {
      id: 1,
      name: "25 CREDITS",
      price: '$9.99',
    },
    {
      id: 2,
      name: "10 CREDITS",
      price: '$5',
    }, {
      id: 3,
      name: "UNLIMITED",
      price: '$20',
    },
  ]

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.container}>
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
            Buy More Credit
          </Text>
          <View></View>
        </View>
        <View style={{ height: 0.85 * screenHeight, alignItems: 'center', }}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={[GlobalStyles.heading, { marginTop: 30 / 930 * screenHeight }]}>
              Buy Credit
            </Text>

            <Text style={[GlobalStyles.text17, { marginTop: 20 / 930 * screenHeight }]}>
              You get free 5 credit renewed every month
            </Text>

            <View style={{ marginTop: 50 / 930 * screenHeight }}>


              {
                plans.map((item) => (
                  <TouchableOpacity key={item.id}
                    onPress={() => {
                      setselectedPlan(item)
                    }}
                  >
                    {item.id === 1 && (
                      <Image
                        source={require("../../assets/Images/recommendedImage.png")}
                        style={{
                          height: (30 / 930) * screenHeight,
                          width: (164 / 430) * screenWidth,
                          resizeMode: "contain",
                          zIndex: 2,
                          alignSelf: "flex-end",
                          marginRight: (0 / 430) * screenWidth,
                          marginBottom: (-45 / 930) * screenHeight,
                          // position: 'relative', top: 0, bottom: 50,
                        }}
                      />
                    )}
                    <View style={{
                      borderWidth: 1, borderColor: selectedPlan.id === item.id ? Colors.orangeColor : Colors.grayColor,
                      borderRadius: 5, alignItems: 'center',
                      paddingVertical: 15, paddingHorizontal: 10, marginTop: 30 / 930 * screenHeight,
                      zIndex: 1
                    }}>
                      <View style={{ width: screenWidth - 80 / 430 * screenWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 15 }}>
                          <Text style={{
                            fontSize: 17, fontFamily: CustomFonts.PoppinsSemiBold, fontWeight: '700',
                            color: Colors.orangeColor
                          }}>
                            {item.name}
                          </Text>

                          <Text style={{
                            fontSize: 17, fontFamily: CustomFonts.PoppinsSemiBold, fontWeight: '700',
                            color: "black"
                          }}>
                            {item.price}
                          </Text>
                        </View>


                        <View style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 15, justifyContent: 'center', alignSelf: 'flex-start',marginTop:5 }}>

                          <Image source={selectedPlan.id === item.id ? selectedImage : unSelectedImage}
                            style={GlobalStyles.image24}
                          />
                          {/* <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterRegular, }}>
                            {item.disc}
                          </Text> */}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                ))
              }
            </View>

            <TouchableOpacity style={GlobalStyles.capsuleBtn}
              onPress={() => {
                // navigation.push(ScreenNames.BuyCreditScreen)
              }}
            >
              <Text style={GlobalStyles.BtnText}>
                Buy Now
              </Text>
            </TouchableOpacity>

            <Text style={{
              fontSize: 13, fontFamily: CustomFonts.InterRegular, alignSelf: 'center', marginTop: 20,
              color: '#00000090'
            }}>
              Payment is charged to your iTunes Account.
            </Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>

  )
}

export default BuyCreditScreen