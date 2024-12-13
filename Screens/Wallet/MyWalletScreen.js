import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import { Image } from 'expo-image'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import React, { useState } from 'react'
import { screenHeight, screenWidth } from '../../res/Constants'

const MyWalletScreen = ({ navigation }) => {

  const cardImage = require('../../assets/Images/visaIcon.png')

  const [selectedCard, setSelectedCard] = useState("")

  const cards = [
    {
      id: 1,
      name: 'VISA',
      disc: 'Editing With',
      number: 9033,
      defaultCard: true,
      image: cardImage
    },
    {
      id: 2,
      name: 'Mastercard',
      disc: 'Editing With',
      number: 9033,
      defaultCard: false,
      image: cardImage
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
            My Wallet
          </Text>
          <TouchableOpacity>
            <Image source={require('../../assets/Images/orangeAddBtn.png')}
              style={{ height: 28 / 930 * screenHeight, width: 28 / 930 * screenHeight }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40 }}>
          <Text style={[GlobalStyles.text14, { marginTop: 50 / 930 * screenHeight, alignSelf: 'flex-start' }]}>
            My Cards
          </Text>

          <FlatList
            data={cards}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCard(item)
                }}
              >
                <View style={{
                  flexDirection: 'column', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: Colors.lightGray,
                  borderRadius: 10, width: screenWidth - 40, marginTop: 22 / 930 * screenHeight
                }}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', width: screenWidth - 80, justifyContent: 'space-between',

                  }}>
                    <Image source={item.image}
                      style={GlobalStyles.image37}
                    />
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 / 930 * screenHeight }}>
                      <Text style={GlobalStyles.text17}>
                        {item.name} {item.disc} {item.number}
                      </Text>
                      {
                        item.defaultCard && (
                          <Text style={[GlobalStyles.text14, { color: '#00000090' }]}>
                            Default Card
                          </Text>
                        )
                      }
                    </View>

                    <Image source={item.id === selectedCard.id ? (
                      require('../../assets/Images/selectedIcon.png')
                    ) : (
                      require('../../assets/Images/unSelectedIcon.png')
                    )}
                    style = {GlobalStyles.image24}

                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MyWalletScreen