import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { Colors } from '../../res/Colors'
import { CustomFonts } from '../../assets/font/Fonts'
import LoadingAnimation from '../../components/LoadingAnimation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScreenNames } from '../../res/ScreenNames'
import axios from 'axios'
import { Apipath } from '../../Api/Apipaths'
import { ShowMessage } from '../../components/ShowMessage'
import AddCardScreen from './AddCardScreen'

const SettlementPaymentScreen = ({ navigation, route }) => {

  const review = route.params.review
  console.log('review on payment screen is', review)

  const cardImage = require('../../assets/Images/visaIcon.png')

  const originalAmount = review.settlementOfferObject && review.settlementOfferObject.amount;
  const percentageIncrease = 5;

  const newAmount = originalAmount + (originalAmount * (percentageIncrease / 100))

  const [selectedCard, setSelectedCard] = useState("")
  const [loading, setLoading] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [cards, setCards] = useState([])

  const paySettle = async () => {
    try {
      setLoading(true)
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)

        let apidata = {
          reviewId: review.id,
          settlementOfferId: review.settlementOfferObject && review.settlementOfferObject.id
        }
        console.log('apidata', apidata)
        //   return

        const response = await axios.post(Apipath.paySettle, apidata, {
          headers: {
            'Authorization': 'Bearer ' + u.token,
            'Content-Type': 'application/json'
          }
        })
        if (response.data) {
          setLoading(false)
          if (response.data.status === true) {
            console.log('settle pay data is', response.data.data)
            navigation.replace(ScreenNames.SettlePayCongratsScreen, {
              status: true
            })
          } else {
            // ShowMessage(response.data.message)
            navigation.replace(ScreenNames.SettlePayCongratsScreen, {
              status: false
            })
            console.log('settle pay message is', response.data.message)
          }
        }
      }
    } catch (e) {
      console.log('error in pay settle is ', e)
    }
  }

  useEffect(() => {
    getCards()
  }, [])

  const getCards = async () => {
    try {
      const data = await AsyncStorage.getItem("USER")
      if (data) {
        let u = JSON.parse(data)
        const response = await axios.get(Apipath.getCards, {
          headers: {
            'Authorization': 'Bearer ' + u.token,
            'Content-Type': 'application/json'
          }
        })
        if (response.data) {
          console.log('cards data is', response.data.data)
          setCards(response.data.data)
        }
      }
    } catch (e) {
      console.log('error in get cards is', e)
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      {
        loading && (
          <LoadingAnimation visible={loading} />
        )
      }
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
            Select Payment Method
          </Text>
          <View></View>
        </View>

        <View style={{
          flexDirection: 'column', alignItems: 'center', gap: 30 / 930 * screenHeight, marginTop: 50 / 930 * screenHeight,
          width: screenWidth - 40
        }}>

          <Text style={GlobalStyles.text14}>
            UID #3840200034
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' }}>
            <Text style={GlobalStyles.text14}>
              Amount to be paid
            </Text>
            <Text style={GlobalStyles.text17}>
              ${review.settlementOfferObject && review.settlementOfferObject.amount}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' }}>
            <Text style={GlobalStyles.text14}>
              Transaction Fee <Image source={require('../../assets/Images/questionCircleIcon.png')}
                style={{ height: 14, width: 14, alignSelf: 'center', paddingTop: 0 }}
              />
            </Text>
            <Text style={GlobalStyles.text17}>
              5%
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 40, justifyContent: 'space-between' }}>
            <Text style={GlobalStyles.text14}>
              Total Payment
            </Text>
            <Text style={GlobalStyles.text17}>
              ${newAmount}
            </Text>
          </View>

          <Text style={[GlobalStyles.text12, { alignSelf: 'center', width: 288 / 430 * screenWidth, textAlign: 'center' }]}>
            By making this payment, you agree to our terms and condition.
          </Text>

          {
            cards.length > 0 && (
              <>
                <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start' }]}>
                  Select Card
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
                              {item.brand} Ending with {item.last4}
                            </Text>
                            {
                              item.isDefault && (
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
                            style={GlobalStyles.image24}

                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />

              </>
            )
          }

          <Text style={[GlobalStyles.text17, { alignSelf: 'flex-start' }]}>
            Select Card
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
                      style={GlobalStyles.image24}

                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={{ alignSelf: 'flex-start' }}
            onPress={() => {
              setShowAddCard(true)
            }}
          >
            <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}>
              Add New
            </Text>
          </TouchableOpacity>


          <Modal
            visible={showAddCard}
            transparent={true}
            animationType="fade"
          >
            <AddCardScreen close={() => { setShowAddCard(false) }} />

          </Modal>

          <TouchableOpacity style={GlobalStyles.capsuleBtn}
            onPress={
              paySettle
            }
          >
            <Text style={GlobalStyles.BtnText}>
              Pay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettlementPaymentScreen